"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import { doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc, increment } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Reward, UserReward, LoyaltyTier } from "@/utils/rewardTypes"
import { recommendRewards } from "@/lib/aiEngine"

export default function LoyaltyPage() {
  const { user } = useAuth()
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([])
  const [userRewards, setUserRewards] = useState<UserReward[]>([])
  const [currentTier, setCurrentTier] = useState<LoyaltyTier | null>(null)
  const [nextTier, setNextTier] = useState<LoyaltyTier | null>(null)
  const [loading, setLoading] = useState(true)
  const [claimingReward, setClaimingReward] = useState<string | null>(null)
  const [recommendation, setRecommendation] = useState<string>("")
  const [loadingRecommendation, setLoadingRecommendation] = useState(false)

  useEffect(() => {
    const fetchLoyaltyData = async () => {
      if (!user) return

      try {
        // Fetch user's loyalty points
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setLoyaltyPoints(userData.loyaltyPoints || 0)
        }

        // Fetch available rewards
        const rewardsRef = collection(db, "rewards")
        const rewardsQuery = query(rewardsRef, where("active", "==", true))
        const rewardsSnapshot = await getDocs(rewardsQuery)

        const rewards: Reward[] = []
        rewardsSnapshot.forEach((doc) => {
          rewards.push({ id: doc.id, ...doc.data() } as Reward)
        })
        setAvailableRewards(rewards)

        // Fetch user's claimed rewards
        const userRewardsRef = collection(db, "userRewards")
        const userRewardsQuery = query(userRewardsRef, where("userId", "==", user.uid))
        const userRewardsSnapshot = await getDocs(userRewardsQuery)

        const userRewardsList: UserReward[] = []
        const rewardPromises = userRewardsSnapshot.docs.map(async (doc) => {
          const userReward = doc.data() as UserReward
          userReward.id = doc.id

          // Fetch the reward details
          const rewardDoc = await getDoc(doc(db, "rewards", userReward.rewardId))
          if (rewardDoc.exists()) {
            userReward.reward = { id: rewardDoc.id, ...rewardDoc.data() } as Reward
          }

          return userReward
        })

        const resolvedUserRewards = await Promise.all(rewardPromises)
        setUserRewards(resolvedUserRewards)

        // Fetch loyalty tiers
        const tiersRef = collection(db, "loyaltyTiers")
        const tiersSnapshot = await getDocs(tiersRef)

        const tiers: LoyaltyTier[] = []
        tiersSnapshot.forEach((doc) => {
          tiers.push({ id: doc.id, ...doc.data() } as LoyaltyTier)
        })

        // Sort tiers by minimum points
        tiers.sort((a, b) => a.minimumPoints - b.minimumPoints)

        // Find current and next tier
        let currentTierFound = null
        let nextTierFound = null

        for (let i = 0; i < tiers.length; i++) {
          if (loyaltyPoints >= tiers[i].minimumPoints) {
            currentTierFound = tiers[i]
            nextTierFound = tiers[i + 1] || null
          } else {
            if (!nextTierFound) nextTierFound = tiers[i]
            break
          }
        }

        setCurrentTier(currentTierFound)
        setNextTier(nextTierFound)
      } catch (error) {
        console.error("Error fetching loyalty data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLoyaltyData()
  }, [user, loyaltyPoints])

  const claimReward = async (reward: Reward) => {
    if (!user) return

    try {
      setClaimingReward(reward.id)

      // Check if user has enough points
      if (loyaltyPoints < reward.pointsCost) {
        alert("You don't have enough points to claim this reward")
        return
      }

      // Generate a unique code for the reward
      const code = Math.random().toString(36).substring(2, 10).toUpperCase()

      // Calculate expiration date (30 days from now)
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)

      // Create user reward in Firestore
      const userRewardRef = await addDoc(collection(db, "userRewards"), {
        userId: user.uid,
        rewardId: reward.id,
        claimed: true,
        used: false,
        code,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
      })

      // Deduct points from user
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        loyaltyPoints: increment(-reward.pointsCost),
      })

      // Update local state
      setLoyaltyPoints(loyaltyPoints - reward.pointsCost)

      // Add the new reward to the user rewards list
      const newUserReward: UserReward = {
        id: userRewardRef.id,
        userId: user.uid,
        rewardId: reward.id,
        reward,
        claimed: true,
        used: false,
        code,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
      }

      setUserRewards([newUserReward, ...userRewards])

      alert(`Reward claimed successfully! Your code is ${code}`)
    } catch (error) {
      console.error("Error claiming reward:", error)
      alert("Failed to claim reward. Please try again.")
    } finally {
      setClaimingReward(null)
    }
  }

  const getPersonalizedRecommendation = async () => {
    if (!user) return

    try {
      setLoadingRecommendation(true)

      // Get user's order history
      const ordersRef = collection(db, "orders")
      const ordersQuery = query(ordersRef, where("userId", "==", user.uid), where("status", "==", "completed"))
      const ordersSnapshot = await getDocs(ordersQuery)

      const orderItems: string[] = []
      ordersSnapshot.forEach((doc) => {
        const order = doc.data()
        if (order.items) {
          order.items.forEach((item: any) => {
            orderItems.push(item.name)
          })
        }
      })

      // Get user's tier
      const userType = currentTier ? currentTier.name : "New Customer"

      // Get AI recommendation
      const recommendation = await recommendRewards(userType, orderItems)
      setRecommendation(recommendation)
    } catch (error) {
      console.error("Error getting recommendation:", error)
      setRecommendation("Unable to generate a recommendation at this time.")
    } finally {
      setLoadingRecommendation(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Loyalty Program</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Your Loyalty Status</h2>
                  <div className="flex items-center">
                    <div className="text-4xl font-bold text-blue-600 mr-3">{loyaltyPoints}</div>
                    <div className="text-gray-600">Points Available</div>
                  </div>
                  {currentTier && (
                    <div className="mt-2">
                      <span className="font-medium">Current Tier:</span> {currentTier.name}
                    </div>
                  )}
                </div>

                {nextTier && (
                  <div className="mt-4 md:mt-0 bg-gray-50 p-4 rounded-lg">
                    <div className="text-center mb-2">
                      <span className="font-medium">Next Tier: {nextTier.name}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${Math.min(100, (loyaltyPoints / nextTier.minimumPoints) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {nextTier.minimumPoints - loyaltyPoints} more points needed
                    </div>
                  </div>
                )}
              </div>

              {currentTier && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Your {currentTier.name} Benefits:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {currentTier.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Available Rewards</h2>

                {availableRewards.length === 0 ? (
                  <p className="text-gray-500">No rewards available at the moment. Check back soon!</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableRewards.map((reward) => (
                      <div key={reward.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{reward.name}</h3>
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                            {reward.pointsCost} points
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{reward.description}</p>

                        <button
                          onClick={() => claimReward(reward)}
                          disabled={loyaltyPoints < reward.pointsCost || claimingReward === reward.id}
                          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {claimingReward === reward.id
                            ? "Claiming..."
                            : loyaltyPoints < reward.pointsCost
                              ? "Not Enough Points"
                              : "Claim Reward"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Personalized Recommendation</h2>
                  <button
                    onClick={getPersonalizedRecommendation}
                    disabled={loadingRecommendation}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                  >
                    {loadingRecommendation ? "Loading..." : "Get Recommendation"}
                  </button>
                </div>

                {recommendation ? (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="italic">{recommendation}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Click the button to get a personalized recommendation based on your order history.
                  </p>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Your Rewards</h2>

                {userRewards.length === 0 ? (
                  <p className="text-gray-500">You haven't claimed any rewards yet.</p>
                ) : (
                  <div className="space-y-4">
                    {userRewards.map((userReward) => (
                      <div key={userReward.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold">{userReward.reward.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{userReward.reward.description}</p>

                        <div className="bg-gray-100 p-2 rounded text-center mb-2">
                          <span className="font-mono font-bold">{userReward.code}</span>
                        </div>

                        <div className="flex justify-between text-xs">
                          <span
                            className={`px-2 py-1 rounded ${userReward.used ? "bg-gray-200 text-gray-800" : "bg-green-100 text-green-800"}`}
                          >
                            {userReward.used ? "Used" : "Available"}
                          </span>
                          <span className="text-gray-500">
                            Expires: {new Date(userReward.expiresAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-semibold mb-4">How to Earn Points</h2>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Earn 1 point for every $1 spent</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Bonus points for referring friends</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Special promotions and events</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Higher point multipliers for higher tiers</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
