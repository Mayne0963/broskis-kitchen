export interface SpecialEvent {
  id: string
  name: string
  description: string
  startDate: string // ISO date string
  endDate: string // ISO date string
  timeSlots: SpecialTimeSlot[]
  isHoliday: boolean
  active: boolean
  image?: string
  specialPricing?: boolean
  specialMenu?: boolean
}

export interface SpecialTimeSlot {
  id: string
  start: string // e.g., "11:00 AM"
  end: string // e.g., "1:00 PM"
  display: string // e.g., "11:00 AM - 1:00 PM"
  available: boolean
  maxOrders?: number // Limit number of orders for this slot
  specialPrice?: number // Special pricing for this slot (percentage discount)
}
