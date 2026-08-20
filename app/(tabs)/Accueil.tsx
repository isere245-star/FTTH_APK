import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function Accueil() {
  return (
    <>
      {/* Conteneur principal de l'écran d'accueil */}
      <View style={styles.container}>
        <Text style={styles.text}>Bienvenue sur FTTH</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#0F172A",
    height: "100%",
  },
  text: {
    color: "#F8FAFC",
    fontSize: 24,
    fontFamily: "sans-serif",
  },
});
