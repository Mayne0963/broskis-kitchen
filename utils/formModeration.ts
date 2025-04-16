import { moderateForm } from "@/lib/aiEngine";

export const aiFormCheck = async (input: string) => {
  const flagged = await moderateForm(input);
  return flagged.toLowerCase().includes("flag") ? true : false;
};