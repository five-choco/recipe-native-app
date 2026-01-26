import { Stack, SplashScreen } from "expo-router";
import { useEffect } from "react";
import { init } from "./database"; // app/database.tsのinit関数をインポート

// データベースの準備が終わるまでスプラッシュスクリーンを表示し続けます
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // データベースを初期化します
    init()
      .then(() => {
        console.log("データベースが正常に初期化されました。");
        // 初期化が成功したらスプラッシュスクリーンを隠します
        SplashScreen.hideAsync();
      })
      .catch((err) => {
        console.error("データベースの初期化に失敗しました。", err);
        // 失敗した場合も、とりあえずスプラッシュスクリーンは隠します
        SplashScreen.hideAsync();
      });
  }, []); // 空の配列を渡すことで、この処理はマウント時に一度しか実行されません

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
