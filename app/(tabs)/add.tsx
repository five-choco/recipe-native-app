import { useState } from "react";
import { Button, Text, TextInput, View, StyleSheet } from "react-native";

export default function AddScreen() {
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleSaveRecipe = () => {
    console.log("レシピを保存:", { recipeName, ingredients, instructions });
    // TODO: データベース保存処理をここに実装
    // TODO: Gemini APIからの生成処理も考慮
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>レシピを追加</Text>

      <TextInput
        style={styles.input}
        placeholder="レシピ名"
        value={recipeName}
        onChangeText={setRecipeName}
      />
      <TextInput
        style={styles.input}
        placeholder="材料"
        value={ingredients}
        onChangeText={setIngredients}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="手順"
        value={instructions}
        onChangeText={setInstructions}
        multiline
      />

      <Button title="レシピを保存" onPress={handleSaveRecipe} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
  },
});
