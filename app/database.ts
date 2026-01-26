import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite"; // 新しいAPIをインポート

const dbPromise = openDatabaseAsync("recipes.db"); // データベース接続をPromiseとして保持



/**
 * データベースの初期化処理
 * recipesテーブルが存在しない場合に作成します。
 */
export const init = async () => {
  const db = await dbPromise; // 非同期でデータベースを開く

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      ingredients TEXT,
      instructions TEXT,
      date TEXT NOT NULL
    );`
  );
  console.log("データベースが正常に初期化されました。"); // 成功メッセージをコンソールに出力
};

export interface Recipe {
  id: number;
  name: string;
  ingredients: string;
  instructions: string;
  date: string; // ISO 8601 形式のYYYY-MM-DD
}

export async function saveRecipe(name: string, ingredients: string, instructions: string): Promise<Recipe> {
  const db = await dbPromise; // データベース接続を取得
  const date = new Date().toISOString().split('T')[0]; // 今日の日付をYYYY-MM-DD形式で取得

  const result = await db.runAsync(
    `INSERT INTO recipes (name, ingredients, instructions, date) VALUES (?, ?, ?, ?)`,
    name, ingredients, instructions, date
  );

  if (result.lastInsertRowId === undefined) {
      throw new Error("Failed to get last inserted row ID.");
  }

  return { id: result.lastInsertRowId, name, ingredients, instructions, date };
}
