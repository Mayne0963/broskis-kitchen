export interface DeliveryZone {
  id: string
  name: string
  zipCodes: string[]
  fee: number // in cents
  minimumOrderAmount: number // in cents
  estimatedTime: string // e.g., "30-45 minutes"
  active: boolean
}

export interface PickupLocation {
  id: string
  name: string
  address: string
  hours: string
  estimatedTime: string // e.g., "15-20 minutes"
  active: boolean
}

export type DeliveryMethod = "delivery" | "pickup"

export interface ScheduleOption {
  date: Date
  timeSlot: string // e.g., "12:00 PM - 1:00 PM"
}

export interface DeliveryInfo {
  method: DeliveryMethod
  address?: {
    street: string
    apt?: string
    city: string
    state: string
    zipCode: string
    instructions?: string
  }
  pickupLocation?: string // ID of pickup location
  contactPhone: string
  scheduledTime?: ScheduleOption // For scheduled orders
  isScheduled: boolean // Flag to indicate if this is a scheduled order
  estimatedTime: string
  fee: number // in cents
}

export interface TimeSlot {
  id: string
  start: string // e.g., "12:00 PM"
  end: string // e.g., "1:00 PM"
  display: string // e.g., "12:00 PM - 1:00 PM"
  available: boolean
}
