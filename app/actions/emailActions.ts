"use server"

import { sendTestEmail as sendTestEmailService } from "@/lib/email-service"

export async function sendTestEmailAction(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const success = await sendTestEmailService(email)

    if (success) {
      return {
        success: true,
        message: `A test email has been sent to ${email}. Please check your inbox.`,
      }
    } else {
      return {
        success: false,
        message: "Failed to send test email. Please check your email configuration.",
      }
    }
  } catch (error) {
    console.error("Error sending test email:", error)
    return {
      success: false,
      message: "An error occurred while sending the test email. Please try again.",
    }
  }
}
