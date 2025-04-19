import * as dotenv from "dotenv"
import * as path from "path"
import * as fs from "fs"

// Load environment variables from .env.local if it exists
const envPath = path.resolve(process.cwd(), ".env.local")
if (fs.existsSync(envPath)) {
  console.log(`📁 Loading environment variables from ${envPath}`)
  dotenv.config({ path: envPath })
} else {
  console.log("⚠️ No .env.local file found. Using existing environment variables.")
}

// Import and run the verification script
require("./verify-env")
