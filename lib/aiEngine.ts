import OpenAI from "openai"

// Check if OpenAI API key is available
const apiKey = process.env.OPENAI_API_KEY
const hasValidApiKey = !!apiKey

// Initialize OpenAI client only if API key is available
const openai = hasValidApiKey ? new OpenAI({ apiKey }) : null

// Helper function to check if OpenAI is available
const isOpenAIAvailable = () => {
  return hasValidApiKey && openai !== null
}

// Fallback responses when OpenAI is not available
const fallbackResponses = {
  moderation: "No issues detected",
  verification: true,
  recommendation: "We recommend trying our most popular items based on your preferences.",
  content: "Check out our latest special offers and menu items!",
  support: "Please contact our customer support team for assistance.",
}

export const moderateForm = async (text: string) => {
  if (!isOpenAIAvailable()) {
    console.warn("OpenAI API key not available. Using fallback for moderation.")
    return fallbackResponses.moderation
  }

  try {
    const res = await openai.chat.completions.create({
      messages: [{ role: "user", content: `Moderate this form input: ${text}` }],
      model: "gpt-4",
    })
    return res.choices[0]?.message?.content || fallbackResponses.moderation
  } catch (error) {
    console.error("Error in moderateForm:", error)
    return fallbackResponses.moderation
  }
}

export const verifyAge = async (dob: string, idName: string) => {
  if (!isOpenAIAvailable()) {
    console.warn("OpenAI API key not available. Using fallback for age verification.")
    return fallbackResponses.verification
  }

  try {
    const res = await openai.chat.completions.create({
      messages: [{ role: "user", content: `Verify this DOB and ID match: DOB=${dob}, ID Name=${idName}` }],
      model: "gpt-4",
    })
    return res.choices[0]?.message?.content.includes("valid") || fallbackResponses.verification
  } catch (error) {
    console.error("Error in verifyAge:", error)
    return fallbackResponses.verification
  }
}

export const recommendRewards = async (userType: string, orders: string[]) => {
  if (!isOpenAIAvailable()) {
    console.warn("OpenAI API key not available. Using fallback for reward recommendations.")
    return fallbackResponses.recommendation
  }

  try {
    const input = `Give a custom reward recommendation for a ${userType} with orders: ${orders.join(", ")}`
    const res = await openai.chat.completions.create({
      messages: [{ role: "user", content: input }],
      model: "gpt-4",
    })
    return res.choices[0]?.message?.content || fallbackResponses.recommendation
  } catch (error) {
    console.error("Error in recommendRewards:", error)
    return fallbackResponses.recommendation
  }
}

export const generateContent = async (type: "promo" | "event" | "offer") => {
  if (!isOpenAIAvailable()) {
    console.warn("OpenAI API key not available. Using fallback for content generation.")
    return fallbackResponses.content
  }

  try {
    const res = await openai.chat.completions.create({
      messages: [{ role: "user", content: `Generate a ${type} for a hip-hop luxury infused food brand` }],
      model: "gpt-4",
    })
    return res.choices[0]?.message?.content || fallbackResponses.content
  } catch (error) {
    console.error("Error in generateContent:", error)
    return fallbackResponses.content
  }
}

export const aiSupportChat = async (question: string) => {
  if (!isOpenAIAvailable()) {
    console.warn("OpenAI API key not available. Using fallback for AI support chat.")
    return fallbackResponses.support
  }

  try {
    const res = await openai.chat.completions.create({
      messages: [{ role: "user", content: question }],
      model: "gpt-4",
    })
    return res.choices[0]?.message?.content || fallbackResponses.support
  } catch (error) {
    console.error("Error in aiSupportChat:", error)
    return fallbackResponses.support
  }
}
