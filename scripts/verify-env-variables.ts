import { execSync } from "child_process"
import * as fs from "fs"
import * as path from "path"

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
  application: ["NEXT_PUBLIC_APP_URL", "AGE_VERIFICATION_EXPIRY_DAYS", "VERCEL"],
}

// Format validation patterns for certain variables
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

// Function to check if we're running in Vercel
function isRunningInVercel() {
  return process.env.VERCEL === "1"
}

// Function to get Vercel environment variables using Vercel CLI
async function getVercelEnvVariables() {
  try {
    // Check if Vercel CLI is installed
    try {
      execSync("vercel --version", { stdio: "ignore" })
    } catch (error) {
      console.error("❌ Vercel CLI is not installed. Please install it with: npm i -g vercel")
      process.exit(1)
    }

    // Check if user is logged in
    try {
      execSync("vercel whoami", { stdio: "ignore" })
    } catch (error) {
      console.error("❌ You are not logged in to Vercel CLI. Please login with: vercel login")
      process.exit(1)
    }

    console.log("🔍 Fetching environment variables from Vercel...")

    // Get project name from package.json
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"))
    const projectName = packageJson.name || "broskiskitchen"

    // Pull environment variables
    const envOutput = execSync(
      `vercel env pull .env.vercel --environment=production --token=${process.env.VERCEL_TOKEN || ""}`,
      {
        stdio: ["pipe", "pipe", "ignore"],
      },
    ).toString()

    console.log("✅ Environment variables fetched successfully")

    // Parse .env.vercel file
    const envFile = fs.readFileSync(".env.vercel", "utf8")
    const envVars = {}

    envFile.split("\n").forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/)
      if (match) {
        envVars[match[1]] = match[2].replace(/^['"](.*)['"]$/, "$1")
      }
    })

    // Clean up
    fs.unlinkSync(".env.vercel")

    return envVars
  } catch (error) {
    console.error("❌ Failed to fetch Vercel environment variables:", error.message)
    return {}
  }
}

// Main function to verify environment variables
async function verifyEnvironmentVariables() {
  console.log("🔍 Starting environment variables verification...")

  // Get environment variables
  const envVars = isRunningInVercel() ? process.env : await getVercelEnvVariables()

  let allValid = true
  const missingVariables = []
  const invalidFormatVariables = []

  // Check each category
  for (const [category, variables] of Object.entries(requiredVariables)) {
    console.log(`\n📋 Checking ${category.toUpperCase()} variables:`)

    for (const variable of variables) {
      const value = envVars[variable]

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

  return { allValid, missingVariables, invalidFormatVariables }
}

// Run the verification if this script is executed directly
if (require.main === module) {
  verifyEnvironmentVariables().catch((error) => {
    console.error("Error during verification:", error)
    process.exit(1)
  })
}

export { verifyEnvironmentVariables, requiredVariables }
