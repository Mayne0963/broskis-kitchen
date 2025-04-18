import { verifyAge } from "@/lib/aiEngine"

export const isVerifiedAge = async (dob: string, idName: string) => {
  return await verifyAge(dob, idName)
}
