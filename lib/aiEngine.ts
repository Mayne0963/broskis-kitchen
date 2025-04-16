import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const moderateForm = async (text: string) => {
  const res = await openai.chat.completions.create({
    messages: [{ role: "user", content: `Moderate this form input: ${text}` }],
    model: "gpt-4",
  });
  return res.choices[0]?.message?.content || "";
};

export const verifyAge = async (dob: string, idName: string) => {
  const res = await openai.chat.completions.create({
    messages: [{ role: "user", content: `Verify this DOB and ID match: DOB=${dob}, ID Name=${idName}` }],
    model: "gpt-4",
  });
  return res.choices[0]?.message?.content.includes("valid") || false;
};

export const recommendRewards = async (userType: string, orders: string[]) => {
  const input = `Give a custom reward recommendation for a ${userType} with orders: ${orders.join(", ")}`;
  const res = await openai.chat.completions.create({
    messages: [{ role: "user", content: input }],
    model: "gpt-4",
  });
  return res.choices[0]?.message?.content || "";
};

export const generateContent = async (type: "promo" | "event" | "offer") => {
  const res = await openai.chat.completions.create({
    messages: [{ role: "user", content: `Generate a ${type} for a hip-hop luxury infused food brand` }],
    model: "gpt-4",
  });
  return res.choices[0]?.message?.content || "";
};

export const aiSupportChat = async (question: string) => {
  const res = await openai.chat.completions.create({
    messages: [{ role: "user", content: question }],
    model: "gpt-4",
  });
  return res.choices[0]?.message?.content || "";
};