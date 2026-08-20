import { Image } from "expo-image";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { Background } from "@react-navigation/elements";
import { useEffect } from "react";

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)/Accueil");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <StatusBar barStyle={"light-content"} />
      {/* Conteneur principal de l'écran de démarrage */}
      <SafeAreaView style={styles.screen}>
        {/* Zone centrale affichant l'identité de l'application */}
        <View style={styles.view}>
          <View style={styles.screens}>
            <View style={styles.header}>
              <Text style={styles.text}>FTTH</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F172A",
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F8FAFC",
  },
  view: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F8FAFC",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "80%",
  },
  screens: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "80%",
  },
  screen: {
    flex: 1,
    backgroundColor: "#101111",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
