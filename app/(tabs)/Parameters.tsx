import {
  View,
  Text,
  Pressable,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

export default function Parameters() {
  return (
    <>
      <StatusBar barStyle={"light-content"} />

      {/* Conteneur principal de l'écran des paramètres */}
      <SafeAreaView style={styleSheet.fond}>
        <Text> Les Parametres </Text>
      </SafeAreaView>
    </>
  );
}

const styleSheet = StyleSheet.create({
  fond: {
    backgroundColor: "#0F172A",
    color: "#94A3B8",
    minHeight: "100%",
  },
});
