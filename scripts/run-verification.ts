import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

async function runVerification() {
  console.log("🚀 Running environment variables verification in Vercel...")

  try {
    // Get the deployment URL from Vercel
    const { stdout: deploymentUrl } = await execAsync("vercel env pull .env.local")
    console.log(`📡 Deployment URL: ${deploymentUrl.trim()}`)

    // Run the verification script
    console.log("\n🔍 Running verification script...")
    const { stdout, stderr } = await execAsync("node scripts/verify-env.ts")

    if (stderr) {
      console.error("❌ Verification failed with error:", stderr)
      return
    }

    console.log(stdout)
  } catch (error) {
    console.error("❌ Failed to run verification:", error)
  }
}

runVerification()
