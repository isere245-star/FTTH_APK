import { Stack } from "expo-router";

function RootLayout() {
  return (
    <>
      {/* Navigation Stack principale de l'application */}
      <Stack>
        {/* Écran de démarrage */}
        <Stack.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
          }}
        />
        {/* Navigation principale par onglets */}
        <Stack.Screen
          name="(tabs)"
          options={{
            title: "Tabs",
            headerShown: false,
          }}
        />
        {/* Écran de fiche de production */}
        <Stack.Screen
          name="Production"
          options={{
            title: "Fiche de production",
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}

export default RootLayout;
