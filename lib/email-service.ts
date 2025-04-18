// This file contains server-only code
import nodemailer from "nodemailer"
import { emailTemplates } from "@/utils/emailTemplates"
import type { OrderStatus } from "@/utils/orderTypes"

// Email configuration
const emailConfig = {
  host: process.env.EMAIL_HOST || "smtp.example.com",
  port: Number.parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER || "user@example.com",
    pass: process.env.EMAIL_PASSWORD || "password",
  },
  from: process.env.EMAIL_FROM || "Broski's Kitchen <orders@broskiskitchen.com>",
}

// Create transporter
const transporter = nodemailer.createTransport(emailConfig)

// Function to send an email
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: emailConfig.from,
      to,
      subject,
      html,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}

// Function to send a test email
export async function sendTestEmail(email: string): Promise<boolean> {
  try {
    const sampleOrder = {
      id: "test_order_123456789",
      createdAt: new Date().toISOString(),
      amount: 2999,
      status: "confirmed",
      items: [
        { name: "Classic Burger", quantity: 1, price: 1699 },
        { name: "Loaded Nachos", quantity: 1, price: 1299 },
      ],
      deliveryInfo: {
        method: "delivery",
        address: {
          street: "123 Test Street",
          city: "Test City",
          state: "TS",
          zipCode: "12345",
        },
        contactPhone: "555-123-4567",
        estimatedTime: "30-45 minutes",
      },
    }

    const subject = "Test Email from Broski's Kitchen"
    const html = emailTemplates.confirmed.body(sampleOrder)

    return await sendEmail(email, subject, html)
  } catch (error) {
    console.error("Error sending test email:", error)
    return false
  }
}

// Function to send order status email
export async function sendOrderStatusEmail(order: any, status: OrderStatus): Promise<boolean> {
  try {
    if (!order || !order.customer) {
      console.error("Invalid order or missing customer email")
      return false
    }

    const template = emailTemplates[status]
    if (!template) {
      console.error(`No email template found for status ${status}`)
      return false
    }

    const subject = template.subject
    const html = template.body(order)

    return await sendEmail(order.customer, subject, html)
  } catch (error) {
    console.error("Error sending order status email:", error)
    return false
  }
}
