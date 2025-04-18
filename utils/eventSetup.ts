import { collection, doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { SpecialEvent } from "./eventTypes"

// Sample special events
export const sampleSpecialEvents: SpecialEvent[] = [
  {
    id: "thanksgiving-2023",
    name: "Thanksgiving Pre-Orders",
    description: "Special Thanksgiving menu available for pre-order. Order early for pickup on Thanksgiving Day!",
    startDate: "2023-11-20", // One week before Thanksgiving
    endDate: "2023-11-23", // Day before Thanksgiving
    isHoliday: false,
    active: true,
    timeSlots: [
      {
        id: "thanksgiving-1",
        start: "10:00 AM",
        end: "12:00 PM",
        display: "10:00 AM - 12:00 PM",
        available: true,
        maxOrders: 20,
      },
      {
        id: "thanksgiving-2",
        start: "12:00 PM",
        end: "2:00 PM",
        display: "12:00 PM - 2:00 PM",
        available: true,
        maxOrders: 20,
      },
      {
        id: "thanksgiving-3",
        start: "2:00 PM",
        end: "4:00 PM",
        display: "2:00 PM - 4:00 PM",
        available: true,
        maxOrders: 20,
      },
    ],
    specialMenu: true,
  },
  {
    id: "thanksgiving-day-2023",
    name: "Thanksgiving Day",
    description: "Thanksgiving Day pickup only. Limited hours.",
    startDate: "2023-11-24", // Thanksgiving Day
    endDate: "2023-11-24",
    isHoliday: true,
    active: true,
    timeSlots: [
      {
        id: "thanksgiving-day-1",
        start: "9:00 AM",
        end: "11:00 AM",
        display: "9:00 AM - 11:00 AM",
        available: true,
        maxOrders: 15,
      },
      {
        id: "thanksgiving-day-2",
        start: "11:00 AM",
        end: "1:00 PM",
        display: "11:00 AM - 1:00 PM",
        available: true,
        maxOrders: 15,
      },
    ],
    specialMenu: true,
  },
  {
    id: "new-years-eve-2023",
    name: "New Year's Eve Special",
    description: "Ring in the New Year with our special menu and extended hours!",
    startDate: "2023-12-31",
    endDate: "2023-12-31",
    isHoliday: true,
    active: true,
    timeSlots: [
      {
        id: "nye-1",
        start: "5:00 PM",
        end: "7:00 PM",
        display: "5:00 PM - 7:00 PM",
        available: true,
        maxOrders: 25,
      },
      {
        id: "nye-2",
        start: "7:00 PM",
        end: "9:00 PM",
        display: "7:00 PM - 9:00 PM",
        available: true,
        maxOrders: 25,
      },
      {
        id: "nye-3",
        start: "9:00 PM",
        end: "11:00 PM",
        display: "9:00 PM - 11:00 PM",
        available: true,
        maxOrders: 25,
        specialPrice: 10, // 10% discount
      },
    ],
    specialMenu: true,
    specialPricing: true,
  },
  {
    id: "valentines-day-2024",
    name: "Valentine's Day Special",
    description: "Celebrate Valentine's Day with our special couples menu!",
    startDate: "2024-02-14",
    endDate: "2024-02-14",
    isHoliday: false,
    active: true,
    timeSlots: [
      {
        id: "vday-1",
        start: "5:00 PM",
        end: "7:00 PM",
        display: "5:00 PM - 7:00 PM",
        available: true,
        maxOrders: 20,
      },
      {
        id: "vday-2",
        start: "7:00 PM",
        end: "9:00 PM",
        display: "7:00 PM - 9:00 PM",
        available: true,
        maxOrders: 20,
      },
      {
        id: "vday-3",
        start: "9:00 PM",
        end: "11:00 PM",
        display: "9:00 PM - 11:00 PM",
        available: true,
        maxOrders: 15,
      },
    ],
    specialMenu: true,
  },
]

// Setup function to add sample special events to Firestore
export async function setupSpecialEvents(): Promise<void> {
  try {
    const eventsCollection = collection(db, "specialEvents")

    for (const event of sampleSpecialEvents) {
      await setDoc(doc(eventsCollection, event.id), event)
    }

    console.log("Sample special events have been added to Firestore")
  } catch (error) {
    console.error("Error setting up special events:", error)
  }
}
