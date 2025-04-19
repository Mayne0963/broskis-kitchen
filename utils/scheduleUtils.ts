import type { TimeSlot } from "./deliveryTypes"
import type { SpecialEvent, SpecialTimeSlot } from "./eventTypes"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Get available dates for scheduling (next 7 days)
export function getAvailableDates(): Date[] {
  const dates: Date[] = []
  const today = new Date()

  // Start from tomorrow
  const startDate = new Date(today)
  startDate.setDate(today.getDate() + 1)

  // Get next 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    dates.push(date)
  }

  return dates
}

// Format date for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

// Get available time slots for a given date
export function getTimeSlots(date: Date): TimeSlot[] {
  // Default time slots (11 AM to 9 PM, hourly)
  const defaultSlots: TimeSlot[] = [
    { id: "11-12", start: "11:00 AM", end: "12:00 PM", display: "11:00 AM - 12:00 PM", available: true },
    { id: "12-13", start: "12:00 PM", end: "1:00 PM", display: "12:00 PM - 1:00 PM", available: true },
    { id: "13-14", start: "1:00 PM", end: "2:00 PM", display: "1:00 PM - 2:00 PM", available: true },
    { id: "14-15", start: "2:00 PM", end: "3:00 PM", display: "2:00 PM - 3:00 PM", available: true },
    { id: "15-16", start: "3:00 PM", end: "4:00 PM", display: "3:00 PM - 4:00 PM", available: true },
    { id: "16-17", start: "4:00 PM", end: "5:00 PM", display: "4:00 PM - 5:00 PM", available: true },
    { id: "17-18", start: "5:00 PM", end: "6:00 PM", display: "5:00 PM - 6:00 PM", available: true },
    { id: "18-19", start: "6:00 PM", end: "7:00 PM", display: "6:00 PM - 7:00 PM", available: true },
    { id: "19-20", start: "7:00 PM", end: "8:00 PM", display: "7:00 PM - 8:00 PM", available: true },
    { id: "20-21", start: "8:00 PM", end: "9:00 PM", display: "8:00 PM - 9:00 PM", available: true },
  ]

  // Check if it's Sunday (0) - if so, open later and close earlier
  const dayOfWeek = date.getDay()
  if (dayOfWeek === 0) {
    // Remove early morning and late evening slots
    return defaultSlots.filter((slot) => !["11-12", "20-21"].includes(slot.id))
  }

  return defaultSlots
}

// Check if a date is valid for scheduling (not in the past)
export function isValidScheduleDate(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const compareDate = new Date(date)
  compareDate.setHours(0, 0, 0, 0)

  return compareDate >= today
}

// Format scheduled time for display
export function formatScheduledTime(date: Date, timeSlot: string): string {
  return `${formatDate(date)} at ${timeSlot}`
}

// Fetch special events from Firestore
export async function getSpecialEvents(): Promise<SpecialEvent[]> {
  try {
    const eventsRef = collection(db, "specialEvents")
    const eventsQuery = query(eventsRef, where("active", "==", true))
    const eventsSnapshot = await getDocs(eventsQuery)

    const events: SpecialEvent[] = []
    eventsSnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as SpecialEvent)
    })

    return events
  } catch (error) {
    console.error("Error fetching special events:", error)
    return []
  }
}

// Check if a date has special events
export async function getSpecialEventsForDate(date: Date): Promise<SpecialEvent[]> {
  try {
    const events = await getSpecialEvents()
    const dateString = date.toISOString().split("T")[0]

    return events.filter((event) => {
      const startDate = new Date(event.startDate).toISOString().split("T")[0]
      const endDate = new Date(event.endDate).toISOString().split("T")[0]
      return dateString >= startDate && dateString <= endDate
    })
  } catch (error) {
    console.error("Error checking for special events:", error)
    return []
  }
}

// Get time slots for a special event
export function getSpecialEventTimeSlots(event: SpecialEvent): SpecialTimeSlot[] {
  return event.timeSlots.filter((slot) => slot.available)
}

// Convert special time slots to regular time slots
export function convertSpecialToRegularTimeSlots(specialSlots: SpecialTimeSlot[]): TimeSlot[] {
  return specialSlots.map((slot) => ({
    id: slot.id,
    start: slot.start,
    end: slot.end,
    display: slot.display,
    available: slot.available,
  }))
}

// Check if a date is a holiday
export async function isHoliday(date: Date): Promise<boolean> {
  const events = await getSpecialEventsForDate(date)
  return events.some((event) => event.isHoliday)
}

// Get combined time slots (regular + special) for a date
export async function getCombinedTimeSlotsForDate(date: Date): Promise<{
  timeSlots: TimeSlot[]
  specialEvents: SpecialEvent[]
  hasSpecialSlots: boolean
}> {
  // Get regular time slots
  const regularSlots = getTimeSlots(date)

  // Get special events for this date
  const specialEvents = await getSpecialEventsForDate(date)

  // If no special events, return regular slots
  if (specialEvents.length === 0) {
    return {
      timeSlots: regularSlots,
      specialEvents: [],
      hasSpecialSlots: false,
    }
  }

  // If there are special events, combine their slots with regular slots
  let combinedSlots: TimeSlot[] = [...regularSlots]
  let hasSpecialSlots = false

  // For each special event, add its time slots
  specialEvents.forEach((event) => {
    // If it's a holiday that replaces regular hours, clear regular slots
    if (event.isHoliday) {
      combinedSlots = []
    }

    // Add special event slots
    const specialSlots = convertSpecialToRegularTimeSlots(event.timeSlots)
    combinedSlots = [...combinedSlots, ...specialSlots]
    hasSpecialSlots = true
  })

  return {
    timeSlots: combinedSlots,
    specialEvents,
    hasSpecialSlots,
  }
}
