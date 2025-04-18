"use server"

import { doc, updateDoc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { sendOrderStatusEmail } from "@/lib/email-service"
import type { OrderStatus } from "@/utils/orderTypes"

// Helper function to check if user has email notifications enabled
async function hasEmailNotificationsEnabled(userId: string): Promise<boolean> {
  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      return true // Default to enabled if user preferences not found
    }

    const userData = userDoc.data()
    return userData.preferences?.emailNotifications !== false
  } catch (error) {
    console.error("Error checking email notification preferences:", error)
    return true // Default to enabled on error
  }
}

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
): Promise<{ success: boolean; message: string }> {
  try {
    // Update order status
    const orderRef = doc(db, "orders", orderId)
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date().toISOString(),
    })

    // Get order details to check user ID and email
    const orderDoc = await getDoc(orderRef)
    if (!orderDoc.exists()) {
      return {
        success: false,
        message: "Order not found",
      }
    }

    const order = { id: orderDoc.id, ...orderDoc.data() }

    // Check if user has email notifications enabled
    let shouldSendEmail = true
    if (order.userId) {
      shouldSendEmail = await hasEmailNotificationsEnabled(order.userId)
    }

    // Send email notification if enabled
    if (shouldSendEmail) {
      const emailSent = await sendOrderStatusEmail(order, status)

      // Update order with notification sent timestamp
      if (emailSent) {
        await updateDoc(orderRef, {
          [`notifications.${status}Sent`]: new Date().toISOString(),
        })

        return {
          success: true,
          message: `Order status updated to ${status} and email notification sent to ${order.customer}`,
        }
      } else {
        return {
          success: true,
          message: "Order status updated but failed to send email notification",
        }
      }
    }

    return {
      success: true,
      message: `Order status updated to ${status}`,
    }
  } catch (error) {
    console.error("Error updating order status:", error)
    return {
      success: false,
      message: "Failed to update order status. Please try again.",
    }
  }
}

export async function resendOrderNotificationAction(orderId: string): Promise<{ success: boolean; message: string }> {
  try {
    // Get order details
    const orderRef = doc(db, "orders", orderId)
    const orderDoc = await getDoc(orderRef)

    if (!orderDoc.exists()) {
      return {
        success: false,
        message: "Order not found",
      }
    }

    const order = { id: orderDoc.id, ...orderDoc.data() }
    const status = order.status as OrderStatus

    // Send email notification
    const emailSent = await sendOrderStatusEmail(order, status)

    if (emailSent) {
      // Update order with notification sent timestamp
      await updateDoc(orderRef, {
        [`notifications.${status}Sent`]: new Date().toISOString(),
      })

      return {
        success: true,
        message: `Email notification for ${status} status has been resent to ${order.customer}`,
      }
    } else {
      return {
        success: false,
        message: "Failed to resend email notification",
      }
    }
  } catch (error) {
    console.error("Error resending notification:", error)
    return {
      success: false,
      message: "Failed to resend notification. Please try again.",
    }
  }
}
