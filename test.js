import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBGnvq5mIskmHhi0llNAfWJeapDu9H5ugE");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function test() {
  try {
    const result = await model.generateContent("hello");
    console.log(result.response.text());
  } catch (e) {
    console.error("ERROR:", e);
  }
}
test();
