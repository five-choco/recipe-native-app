import { useState } from "react";
import { Button, Text, TextInput, View, StyleSheet, ActivityIndicator, Alert, ScrollView } from "react-native";
import * as Clipboard from "expo-clipboard";
import { saveRecipe } from "../database"; // saveRecipe関数をインポート
import { GeneratedRecipe, generateRecipeFromText } from "../services/gemini"; // Gemini APIヘルパーをインポート

export default function AddScreen() {
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [geminiPrompt, setGeminiPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveRecipe = async () => {
    if (!recipeName.trim() || !ingredients.trim() || !instructions.trim()) {
      Alert.alert("エラー", "レシピ名、材料、手順をすべて入力してください。");
      return;
    }

    try {
      await saveRecipe(recipeName, ingredients, instructions);
      Alert.alert("成功", "レシピが保存されました！");
      // フォームをクリア
      setRecipeName("");
      setIngredients("");
      setInstructions("");
    } catch (error) {
      console.error("レシピ保存エラー:", error);
      Alert.alert(
        "エラー",
        `レシピの保存に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  const handleGenerateFromGemini = async () => {
    if (!geminiPrompt.trim()) {
      Alert.alert("エラー", "Geminiへのプロンプトを入力してください。");
      return;
    }
    setIsLoading(true);
    console.log("Gemini APIからレシピを生成:", geminiPrompt);

    try {
      const generatedRecipe: GeneratedRecipe =
        await generateRecipeFromText(geminiPrompt);
      if (
        generatedRecipe.name ||
        generatedRecipe.ingredients ||
        generatedRecipe.instructions
      ) {
        setRecipeName(generatedRecipe.name);
        setIngredients(generatedRecipe.ingredients);
        setInstructions(generatedRecipe.instructions);
        Alert.alert("成功", "Geminiからレシピが生成されました！");
      } else {
        Alert.alert(
          "情報",
          "Geminiはレシピを見つけられませんでした。別のテキストをお試しください。",
        );
      }
    } catch (error) {
      Alert.alert(
        "エラー",
        `レシピの生成に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        setGeminiPrompt(text);
        Alert.alert(
          "ペースト完了",
          "クリップボードのテキストを貼り付けました。",
        );
      } else {
        Alert.alert(
          "ペースト失敗",
          "クリップボードにテキストが見つかりません。",
        );
      }
    } catch (error) {
      console.error("クリップボードからのペーストエラー:", error);
      Alert.alert("エラー", "クリップボードからの読み取りに失敗しました。");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>レシピを追加</Text>

      {/* Gemini API連携セクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Geminiでレシピを生成</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="SNSの投稿などからテキストをコピー＆ペースト"
          value={geminiPrompt}
          onChangeText={setGeminiPrompt}
          multiline
          numberOfLines={4}
        />
        <View style={styles.buttonContainer}>
          <Button
            title="クリップボードからペースト"
            onPress={handlePasteFromClipboard}
          />
          <Button
            title={isLoading ? "生成中..." : "AIからレシピを生成"}
            onPress={handleGenerateFromGemini}
            disabled={isLoading}
          />
        </View>
        {isLoading && (
          <ActivityIndicator
            style={styles.loadingIndicator}
            size="small"
            color="#0000ff"
          />
        )}
      </View>

      {/* 手動入力セクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>または手動で入力</Text>
        <TextInput
          style={styles.input}
          placeholder="レシピ名"
          value={recipeName}
          onChangeText={setRecipeName}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="材料"
          value={ingredients}
          onChangeText={setIngredients}
          multiline
          numberOfLines={4}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="手順"
          value={instructions}
          onChangeText={setInstructions}
          multiline
          numberOfLines={6}
        />
        <Button title="レシピを保存" onPress={handleSaveRecipe} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  textArea: {
    height: 100, // 高さを確保
    textAlignVertical: "top", // Androidでテキストが上から始まるようにする
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 15,
  },
  loadingIndicator: {
    marginTop: 10,
  },
});
