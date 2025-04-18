export type OrderStatus = "confirmed" | "processing" | "completed" | "cancelled"

export interface OrderNotifications {
  confirmedSent?: string // ISO date string
  processingSent?: string // ISO date string
  completedSent?: string // ISO date string
  cancelledSent?: string // ISO date string
}

export interface Order {
  id: string
  amount: number
  status: OrderStatus
  paymentStatus: string
  createdAt: string
  customer: string
  userId: string
  items?: any[]
  deliveryInfo?: {
    method: "delivery" | "pickup"
    address?: {
      street: string
      apt?: string
      city: string
      state: string
      zipCode: string
      instructions?: string
    }
    pickupLocation?: string
    contactPhone: string
    estimatedTime: string
  }
  isScheduled?: boolean
  scheduledInfo?: {
    date: string
    timeSlot: string
  }
  specialEvent?: string
  notifications?: OrderNotifications
}
