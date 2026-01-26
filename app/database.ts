import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite"; // 新しいAPIをインポート

let db: SQLiteDatabase | null = null; // データベースオブジェクトを保持する変数を宣言

/**
 * データベースの初期化処理
 * recipesテーブルが存在しない場合に作成します。
 */
export const init = async () => {
  // async関数に変更
  if (!db) {
    db = await openDatabaseAsync("recipes.db"); // 非同期でデータベースを開く
  }

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
