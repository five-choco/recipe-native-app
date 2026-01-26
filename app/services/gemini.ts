import { GoogleGenerativeAI } from "@google/generative-ai";
// ConstantsはもうAPIキーの取得に使用しないため削除しました

// APIキーを.envから取得
// Metro BundlerがEXPO_PUBLIC_で始まる環境変数を自動的に読み込みます
const geminiApiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error(
    "Gemini API Key is not configured in .env file. Please set EXPO_PUBLIC_GEMINI_API_KEY.",
  );
}

// Gemini APIクライアントを初期化
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export interface GeneratedRecipe {
  name: string;
  ingredients: string;
  instructions: string;
}

/**
 * Gemini APIを呼び出し、与えられたテキストからレシピを生成します。
 * @param inputText SNSの投稿などからコピーされたテキスト
 * @returns 構造化されたレシピオブジェクト (name, ingredients, instructions)
 */
export async function generateRecipeFromText(
  inputText: string,
): Promise<GeneratedRecipe> {
  // プロンプトに「JSONで返して」という指示を強めに含める
  const prompt = `以下のテキストからレシピを抽出し、必ず以下のJSON形式で回答してください。
  {"name": "料理名", "ingredients": "材料", "instructions": "手順"}
  
  テキスト: ${inputText}`;

  try {
    // contents: [...] ではなく、直接文字列を渡す（SDKが良しなに処理してくれます）
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("生応答:", text); // ここで中身が見れれば成功！

    const cleanedText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini API呼び出しエラー:", error);
    throw error;
  }
}
