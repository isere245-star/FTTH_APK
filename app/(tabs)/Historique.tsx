import {
  View,
  Text,
  Pressable,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

export default function Historique() {
  return (
    <>
      <StatusBar barStyle={"light-content"} />

      {/* Conteneur principal de l'écran historique */}
      <SafeAreaView style={styleSheet.fond}>
        <Text
            style = {{
                color: "#94A3B8",
                fontSize: 16,
                padding: 20,
                textAlign: "center",
            }}> 
            La fonctionalité des historiques de sauvegarde vers le cloud ne sont pas encore active. Veuillez patienter pour les prochaines mises à jour. </Text>
            <ActivityIndicator color="#94A3B8" />
      </SafeAreaView>
    </>
  );
}

const styleSheet = StyleSheet.create({
  fond: {
    backgroundColor: "#0F172A",
    color: "#94A3B8",
    minHeight: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
