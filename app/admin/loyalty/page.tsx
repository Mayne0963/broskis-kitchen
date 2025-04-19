"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import { collection, query, orderBy, getDocs, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import { checkUserRole } from "@/utils/roleCheck"
import { useRouter } from "next/navigation"
import type { Reward, LoyaltyTier } from "@/utils/rewardTypes"

export default function AdminLoyaltyPage() {
  const { user } = useAuth()
  const [rewards, setRewards] = useState<Reward[]>([])
  const [tiers, setTiers] = useState<LoyaltyTier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  // Form states
  const [showRewardForm, setShowRewardForm] = useState(false)
  const [showTierForm, setShowTierForm] = useState(false)
  const [editingReward, setEditingReward] = useState<Reward | null>(null)
  const [editingTier, setEditingTier] = useState<LoyaltyTier | null>(null)

  // New reward form state
  const [rewardName, setRewardName] = useState("")
  const [rewardDescription, setRewardDescription] = useState("")
  const [rewardPointsCost, setRewardPointsCost] = useState(0)
  const [rewardType, setRewardType] = useState<"discount" | "freeItem" | "special">("discount")
  const [rewardValue, setRewardValue] = useState(0)
  const [rewardActive, setRewardActive] = useState(true)

  // New tier form state
  const [tierName, setTierName] = useState("")
  const [tierMinimumPoints, setTierMinimumPoints] = useState(0)
  const [tierBenefits, setTierBenefits] = useState<string[]>([""])
  const [tierMultiplier, setTierMultiplier] = useState(1)

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return

      try {
        const hasAdminRole = await checkUserRole(user, ["admin"])
        setIsAdmin(hasAdminRole)
        if (!hasAdminRole) {
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Error checking admin role:", error)
        router.push("/dashboard")
      }
    }

    checkAdmin()
  }, [user, router])

  useEffect(() => {
    const fetchLoyaltyData = async () => {
      if (!user || !isAdmin) return

      try {
        // Fetch rewards
        const rewardsRef = collection(db, "rewards")
        const rewardsQuery = query(rewardsRef, orderBy("createdAt", "desc"))
        const rewardsSnapshot = await getDocs(rewardsQuery)

        const rewardsList: Reward[] = []
        rewardsSnapshot.forEach((doc) => {
          rewardsList.push({ id: doc.id, ...doc.data() } as Reward)
        })
        setRewards(rewardsList)

        // Fetch tiers
        const tiersRef = collection(db, "loyaltyTiers")
        const tiersQuery = query(tiersRef, orderBy("minimumPoints", "asc"))
        const tiersSnapshot = await getDocs(tiersQuery)

        const tiersList: LoyaltyTier[] = []
        tiersSnapshot.forEach((doc) => {
          tiersList.push({ id: doc.id, ...doc.data() } as LoyaltyTier)
        })
        setTiers(tiersList)
      } catch (error) {
        console.error("Error fetching loyalty data:", error)
        setError("Failed to load loyalty program data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) {
      fetchLoyaltyData()
    }
  }, [user, isAdmin])

  const resetRewardForm = () => {
    setRewardName("")
    setRewardDescription("")
    setRewardPointsCost(0)
    setRewardType("discount")
    setRewardValue(0)
    setRewardActive(true)
    setEditingReward(null)
  }

  const resetTierForm = () => {
    setTierName("")
    setTierMinimumPoints(0)
    setTierBenefits([""])
    setTierMultiplier(1)
    setEditingTier(null)
  }

  const handleEditReward = (reward: Reward) => {
    setEditingReward(reward)
    setRewardName(reward.name)
    setRewardDescription(reward.description)
    setRewardPointsCost(reward.pointsCost)
    setRewardType(reward.type)
    setRewardValue(reward.value)
    setRewardActive(reward.active)
    setShowRewardForm(true)
  }

  const handleEditTier = (tier: LoyaltyTier) => {
    setEditingTier(tier)
    setTierName(tier.name)
    setTierMinimumPoints(tier.minimumPoints)
    setTierBenefits(tier.benefits)
    setTierMultiplier(tier.multiplier)
    setShowTierForm(true)
  }

  const handleAddBenefit = () => {
    setTierBenefits([...tierBenefits, ""])
  }

  const handleRemoveBenefit = (index: number) => {
    const newBenefits = [...tierBenefits]
    newBenefits.splice(index, 1)
    setTierBenefits(newBenefits)
  }

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...tierBenefits]
    newBenefits[index] = value
    setTierBenefits(newBenefits)
  }

  const handleSubmitReward = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!rewardName || !rewardDescription || rewardPointsCost <= 0) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const rewardData = {
        name: rewardName,
        description: rewardDescription,
        pointsCost: rewardPointsCost,
        type: rewardType,
        value: rewardValue,
        active: rewardActive,
        createdAt: new Date().toISOString(),
      }

      if (editingReward) {
        // Update existing reward
        await updateDoc(doc(db, "rewards", editingReward.id), rewardData)

        // Update local state
        setRewards(rewards.map((reward) => (reward.id === editingReward.id ? { ...reward, ...rewardData } : reward)))
      } else {
        // Create new reward
        const docRef = await addDoc(collection(db, "rewards"), rewardData)

        // Update local state
        setRewards([{ id: docRef.id, ...rewardData } as Reward, ...rewards])
      }

      resetRewardForm()
      setShowRewardForm(false)
    } catch (error) {
      console.error("Error saving reward:", error)
      alert("Failed to save reward. Please try again.")
    }
  }

  const handleSubmitTier = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tierName || tierMinimumPoints < 0 || tierBenefits.some((benefit) => !benefit)) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const tierData = {
        name: tierName,
        minimumPoints: tierMinimumPoints,
        benefits: tierBenefits.filter((benefit) => benefit.trim() !== ""),
        multiplier: tierMultiplier,
      }

      if (editingTier) {
        // Update existing tier
        await updateDoc(doc(db, "loyaltyTiers", editingTier.id), tierData)

        // Update local state
        setTiers(tiers.map((tier) => (tier.id === editingTier.id ? { ...tier, ...tierData } : tier)))
      } else {
        // Create new tier
        const docRef = await addDoc(collection(db, "loyaltyTiers"), tierData)

        // Update local state
        setTiers([...tiers, { id: docRef.id, ...tierData } as LoyaltyTier])
      }

      resetTierForm()
      setShowTierForm(false)
    } catch (error) {
      console.error("Error saving tier:", error)
      alert("Failed to save tier. Please try again.")
    }
  }

  const handleDeleteReward = async (rewardId: string) => {
    if (!confirm("Are you sure you want to delete this reward?")) return

    try {
      await deleteDoc(doc(db, "rewards", rewardId))

      // Update local state
      setRewards(rewards.filter((reward) => reward.id !== rewardId))
    } catch (error) {
      console.error("Error deleting reward:", error)
      alert("Failed to delete reward. Please try again.")
    }
  }

  const handleDeleteTier = async (tierId: string) => {
    if (!confirm("Are you sure you want to delete this tier?")) return

    try {
      await deleteDoc(doc(db, "loyaltyTiers", tierId))

      // Update local state
      setTiers(tiers.filter((tier) => tier.id !== tierId))
    } catch (error) {
      console.error("Error deleting tier:", error)
      alert("Failed to delete tier. Please try again.")
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Loyalty Program Management</h1>
          <Link href="/admin" className="text-blue-600 hover:underline flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin
          </Link>
        </div>

        {error && <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-md">{error}</div>}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rewards Management */}
            <div>
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Rewards</h2>
                  <button
                    onClick={() => {
                      resetRewardForm()
                      setShowRewardForm(!showRewardForm)
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {showRewardForm ? "Cancel" : "Add Reward"}
                  </button>
                </div>

                {showRewardForm && (
                  <form onSubmit={handleSubmitReward} className="mb-6 p-4 border rounded-lg">
                    <h3 className="font-semibold mb-4">{editingReward ? "Edit Reward" : "New Reward"}</h3>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={rewardName}
                        onChange={(e) => setRewardName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={rewardDescription}
                        onChange={(e) => setRewardDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Points Cost</label>
                        <input
                          type="number"
                          value={rewardPointsCost}
                          onChange={(e) => setRewardPointsCost(Number.parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          min="0"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          value={rewardType}
                          onChange={(e) => setRewardType(e.target.value as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="discount">Discount</option>
                          <option value="freeItem">Free Item</option>
                          <option value="special">Special Offer</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {rewardType === "discount" ? "Discount Percentage" : "Value"}
                      </label>
                      <input
                        type="number"
                        value={rewardValue}
                        onChange={(e) => setRewardValue(Number.parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        min="0"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={rewardActive}
                          onChange={(e) => setRewardActive(e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                      </label>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        {editingReward ? "Update Reward" : "Create Reward"}
                      </button>
                    </div>
                  </form>
                )}

                {rewards.length === 0 ? (
                  <p className="text-gray-500">No rewards have been created yet.</p>
                ) : (
                  <div className="space-y-4">
                    {rewards.map((reward) => (
                      <div key={reward.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{reward.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="font-medium">{reward.pointsCost} points</span>
                              <span
                                className={`px-2 py-0.5 rounded ${reward.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                              >
                                {reward.active ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditReward(reward)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteReward(reward.id)}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Loyalty Tiers Management */}
            <div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Loyalty Tiers</h2>
                  <button
                    onClick={() => {
                      resetTierForm()
                      setShowTierForm(!showTierForm)
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {showTierForm ? "Cancel" : "Add Tier"}
                  </button>
                </div>

                {showTierForm && (
                  <form onSubmit={handleSubmitTier} className="mb-6 p-4 border rounded-lg">
                    <h3 className="font-semibold mb-4">{editingTier ? "Edit Tier" : "New Tier"}</h3>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={tierName}
                        onChange={(e) => setTierName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Points</label>
                        <input
                          type="number"
                          value={tierMinimumPoints}
                          onChange={(e) => setTierMinimumPoints(Number.parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          min="0"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Points Multiplier</label>
                        <input
                          type="number"
                          value={tierMultiplier}
                          onChange={(e) => setTierMultiplier(Number.parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          min="1"
                          step="0.1"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                      {tierBenefits.map((benefit, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <input
                            type="text"
                            value={benefit}
                            onChange={(e) => handleBenefitChange(index, e.target.value)}
                            className="flex-grow px-3 py-2 border border-gray-300 rounded-md mr-2"
                            placeholder="Enter a benefit"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveBenefit(index)}
                            className="p-2 text-red-600 hover:text-red-800"
                            disabled={tierBenefits.length === 1}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddBenefit}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Add Another Benefit
                      </button>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        {editingTier ? "Update Tier" : "Create Tier"}
                      </button>
                    </div>
                  </form>
                )}

                {tiers.length === 0 ? (
                  <p className="text-gray-500">No loyalty tiers have been created yet.</p>
                ) : (
                  <div className="space-y-4">
                    {tiers.map((tier) => (
                      <div key={tier.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{tier.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">Minimum Points: {tier.minimumPoints}</p>
                            <p className="text-sm text-gray-600 mb-2">Points Multiplier: {tier.multiplier}x</p>
                            <div className="mt-2">
                              <h4 className="text-sm font-medium">Benefits:</h4>
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                {tier.benefits.map((benefit, index) => (
                                  <li key={index}>{benefit}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditTier(tier)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteTier(tier.id)}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
