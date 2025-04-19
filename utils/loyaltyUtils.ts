import { doc, getDoc, updateDoc, increment, collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { LoyaltyTier } from "./rewardTypes"

export async function calculatePointsForPurchase(userId: string, amount: number): Promise<number> {
  try {
    // Get user's current tier
    const userDoc = await getDoc(doc(db, "users", userId))
    if (!userDoc.exists()) {
      return 0
    }

    const userData = userDoc.data()
    const userPoints = userData.loyaltyPoints || 0

    // Get all loyalty tiers
    const tiersRef = collection(db, "loyaltyTiers")
    const tiersSnapshot = await getDocs(tiersRef)

    const tiers: LoyaltyTier[] = []
    tiersSnapshot.forEach((doc) => {
      tiers.push({ id: doc.id, ...doc.data() } as LoyaltyTier)
    })

    // Sort tiers by minimum points
    tiers.sort((a, b) => a.minimumPoints - b.minimumPoints)

    // Find user's current tier
    let currentTier: LoyaltyTier | null = null
    for (const tier of tiers) {
      if (userPoints >= tier.minimumPoints) {
        currentTier = tier
      } else {
        break
      }
    }

    // Calculate points to award
    // Base: 1 point per dollar spent
    const basePoints = Math.floor(amount / 100)

    // Apply tier multiplier if applicable
    const multiplier = currentTier ? currentTier.multiplier : 1
    const totalPoints = Math.floor(basePoints * multiplier)

    return totalPoints
  } catch (error) {
    console.error("Error calculating loyalty points:", error)
    return 0
  }
}

export async function awardLoyaltyPoints(userId: string, points: number): Promise<boolean> {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      loyaltyPoints: increment(points),
    })
    return true
  } catch (error) {
    console.error("Error awarding loyalty points:", error)
    return false
  }
}

export async function deductLoyaltyPoints(userId: string, points: number): Promise<boolean> {
  try {
    // Check if user has enough points
    const userDoc = await getDoc(doc(db, "users", userId))
    if (!userDoc.exists()) {
      return false
    }

    const userData = userDoc.data()
    const userPoints = userData.loyaltyPoints || 0

    if (userPoints < points) {
      return false
    }

    // Deduct points
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      loyaltyPoints: increment(-points),
    })

    return true
  } catch (error) {
    console.error("Error deducting loyalty points:", error)
    return false
  }
}
