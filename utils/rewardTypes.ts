export interface Reward {
  id: string
  name: string
  description: string
  pointsCost: number
  type: "discount" | "freeItem" | "special"
  value: number // Percentage discount or item ID
  image?: string
  active: boolean
  expiresAt?: string
  createdAt: string
}

export interface UserReward {
  id: string
  userId: string
  rewardId: string
  reward: Reward
  claimed: boolean
  used: boolean
  code: string
  expiresAt: string
  createdAt: string
}

export interface LoyaltyTier {
  id: string
  name: string
  minimumPoints: number
  benefits: string[]
  multiplier: number // Points multiplier for this tier
}
