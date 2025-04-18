"use server"

import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function updateEmailPreferencesAction(
  userId: string,
  enabled: boolean,
): Promise<{
  success: boolean
  message: string
}> {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      "preferences.emailNotifications": enabled,
    })
    return {
      success: true,
      message: "Your notification preferences have been saved.",
    }
  } catch (error) {
    console.error("Error updating email notification preferences:", error)
    return {
      success: false,
      message: "An error occurred while saving your preferences. Please try again.",
    }
  }
}

export async function getUserEmailPreferencesAction(userId: string): Promise<{
  emailNotifications: boolean
}> {
  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      return { emailNotifications: true } // Default to enabled if user preferences not found
    }

    const userData = userDoc.data()
    return {
      emailNotifications: userData.preferences?.emailNotifications !== false,
    }
  } catch (error) {
    console.error("Error fetching user preferences:", error)
    return { emailNotifications: true } // Default to enabled on error
  }
}
