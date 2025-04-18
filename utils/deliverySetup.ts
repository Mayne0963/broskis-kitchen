import { collection, doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { DeliveryZone, PickupLocation } from "./deliveryTypes"

export const sampleDeliveryZones: DeliveryZone[] = [
  {
    id: "zone-downtown",
    name: "Downtown",
    zipCodes: ["10001", "10002", "10003", "10004", "10005"],
    fee: 499, // $4.99
    minimumOrderAmount: 2000, // $20.00
    estimatedTime: "30-45 minutes",
    active: true,
  },
  {
    id: "zone-midtown",
    name: "Midtown",
    zipCodes: ["10016", "10017", "10018", "10019", "10020"],
    fee: 599, // $5.99
    minimumOrderAmount: 2000, // $20.00
    estimatedTime: "40-55 minutes",
    active: true,
  },
  {
    id: "zone-uptown",
    name: "Uptown",
    zipCodes: ["10025", "10026", "10027", "10028", "10029"],
    fee: 699, // $6.99
    minimumOrderAmount: 2500, // $25.00
    estimatedTime: "45-60 minutes",
    active: true,
  },
]

export const samplePickupLocations: PickupLocation[] = [
  {
    id: "location-main",
    name: "Broski's Kitchen - Main",
    address: "123 Main Street, New York, NY 10001",
    hours: "Mon-Fri: 11am-10pm, Sat-Sun: 12pm-11pm",
    estimatedTime: "15-20 minutes",
    active: true,
  },
  {
    id: "location-midtown",
    name: "Broski's Kitchen - Midtown",
    address: "456 Park Avenue, New York, NY 10022",
    hours: "Mon-Sun: 11am-11pm",
    estimatedTime: "15-20 minutes",
    active: true,
  },
]

export async function setupDeliveryZones(): Promise<void> {
  try {
    const zonesCollection = collection(db, "deliveryZones")

    for (const zone of sampleDeliveryZones) {
      await setDoc(doc(zonesCollection, zone.id), zone)
    }

    console.log("Sample delivery zones have been added to Firestore")
  } catch (error) {
    console.error("Error setting up delivery zones:", error)
  }
}

export async function setupPickupLocations(): Promise<void> {
  try {
    const locationsCollection = collection(db, "pickupLocations")

    for (const location of samplePickupLocations) {
      await setDoc(doc(locationsCollection, location.id), location)
    }

    console.log("Sample pickup locations have been added to Firestore")
  } catch (error) {
    console.error("Error setting up pickup locations:", error)
  }
}
