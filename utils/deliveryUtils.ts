import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { DeliveryZone, PickupLocation } from "./deliveryTypes"

export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  try {
    const zonesRef = collection(db, "deliveryZones")
    const zonesQuery = query(zonesRef, where("active", "==", true))
    const zonesSnapshot = await getDocs(zonesQuery)

    const zones: DeliveryZone[] = []
    zonesSnapshot.forEach((doc) => {
      zones.push({ id: doc.id, ...doc.data() } as DeliveryZone)
    })

    return zones
  } catch (error) {
    console.error("Error fetching delivery zones:", error)
    return []
  }
}

export async function getPickupLocations(): Promise<PickupLocation[]> {
  try {
    const locationsRef = collection(db, "pickupLocations")
    const locationsQuery = query(locationsRef, where("active", "==", true))
    const locationsSnapshot = await getDocs(locationsQuery)

    const locations: PickupLocation[] = []
    locationsSnapshot.forEach((doc) => {
      locations.push({ id: doc.id, ...doc.data() } as PickupLocation)
    })

    return locations
  } catch (error) {
    console.error("Error fetching pickup locations:", error)
    return []
  }
}

export function isZipCodeInDeliveryArea(zipCode: string, zones: DeliveryZone[]): DeliveryZone | null {
  for (const zone of zones) {
    if (zone.zipCodes.includes(zipCode)) {
      return zone
    }
  }
  return null
}

export function calculateDeliveryFee(subtotal: number, zone: DeliveryZone): number {
  // If order meets minimum amount, return the standard fee
  if (subtotal >= zone.minimumOrderAmount) {
    return zone.fee
  }

  // Otherwise, return the fee plus a message (handled in UI)
  return zone.fee
}

export function formatEstimatedTime(time: string): string {
  return time
}
