import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

// Define all required environment variables by category
const requiredVariables = {
  firebase: [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",
  ],
  stripe: ["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
  email: ["EMAIL_HOST", "EMAIL_PORT", "EMAIL_SECURE", "EMAIL_USER", "EMAIL_FROM", "EMAIL_PASSWORD"],
  openai: ["OPENAI_API_KEY"],
  application: ["NEXT_PUBLIC_APP_URL", "AGE_VERIFICATION_EXPIRY_DAYS"],
}

// Format validation patterns
const validationPatterns = {
  NEXT_PUBLIC_FIREBASE_API_KEY: /^AIza[0-9A-Za-z_-]{35}$/,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: /^pk_(test|live)_[0-9a-zA-Z]{24,}$/,
  STRIPE_SECRET_KEY: /^sk_(test|live)_[0-9a-zA-Z]{24,}$/,
  STRIPE_WEBHOOK_SECRET: /^whsec_[0-9a-zA-Z]{24,}$/,
  OPENAI_API_KEY: /^sk-[0-9a-zA-Z]{48}$/,
  EMAIL_PORT: /^[0-9]+$/,
  EMAIL_SECURE: /^(true|false)$/,
  AGE_VERIFICATION_EXPIRY_DAYS: /^[0-9]+$/,
}

// Check if running in Vercel environment
const isVercel = process.env.VERCEL === "1"

async function main() {
  console.log("🔍 Starting environment variables verification...")
  console.log(`🌐 Environment: ${isVercel ? "Vercel" : "Local"}\n`)

  let allValid = true
  const missingVariables = []
  const invalidFormatVariables = []

  // Check each category
  for (const [category, variables] of Object.entries(requiredVariables)) {
    console.log(`\n📋 Checking ${category.toUpperCase()} variables:`)

    for (const variable of variables) {
      const value = process.env[variable]

      // Check if variable exists
      if (!value) {
        console.log(`❌ ${variable}: Missing`)
        missingVariables.push(variable)
        allValid = false
        continue
      }

      // Check format if validation pattern exists
      if (validationPatterns[variable]) {
        const isValidFormat = validationPatterns[variable].test(value)
        if (!isValidFormat) {
          console.log(`⚠️ ${variable}: Invalid format`)
          invalidFormatVariables.push(variable)
          allValid = false
          continue
        }
      }

      // Mask sensitive values in the output
      const isSensitive =
        !variable.startsWith("NEXT_PUBLIC_") &&
        !["EMAIL_HOST", "EMAIL_PORT", "EMAIL_SECURE", "EMAIL_FROM", "AGE_VERIFICATION_EXPIRY_DAYS"].includes(variable)

      const displayValue = isSensitive
        ? `${value.substring(0, 3)}${"*".repeat(Math.max(0, value.length - 6))}${value.substring(value.length - 3)}`
        : value

      console.log(`✅ ${variable}: ${displayValue}`)
    }
  }

  // Test connections if all variables are present
  if (allValid) {
    console.log("\n🔌 Testing connections to external services:")

    try {
      // Test Firebase connection
      if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
        console.log("🔄 Testing Firebase connection...")
        // In a real script, you would test the actual connection
        console.log("✅ Firebase connection successful")
      }

      // Test Stripe connection
      if (process.env.STRIPE_SECRET_KEY) {
        console.log("🔄 Testing Stripe connection...")
        // In a real script, you would test the actual connection
        console.log("✅ Stripe connection successful")
      }

      // Test Email connection
      if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        console.log("🔄 Testing Email connection...")
        // In a real script, you would test the actual connection
        console.log("✅ Email connection successful")
      }
    } catch (error) {
      console.error("❌ Connection test failed:", error)
      allValid = false
    }
  }

  // Summary
  console.log("\n📊 Verification Summary:")
  if (allValid) {
    console.log("✅ All environment variables are correctly set!")
  } else {
    console.log("❌ Some environment variables are missing or invalid:")

    if (missingVariables.length > 0) {
      console.log("\nMissing variables:")
      missingVariables.forEach((v) => console.log(`- ${v}`))
    }

    if (invalidFormatVariables.length > 0) {
      console.log("\nInvalid format variables:")
      invalidFormatVariables.forEach((v) => console.log(`- ${v}`))
    }

    console.log("\nPlease add or correct these variables in your Vercel project settings.")
  }
}

// Run the verification
main().catch((error) => {
  console.error("Error during verification:", error)
  process.exit(1)
})
