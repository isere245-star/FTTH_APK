import { Stack } from "expo-router";

function RootLayout () {
  return (
    <Stack>
      <Stack.Screen 
        name = 'index' 
        options={{
          title : 'Home', 
          headerShown : false}}
      />
      <Stack.Screen 
        name = '(tabs)' 
        options={{ 
          title: 'Tabs',
          headerShown : false }}
      />
      <Stack.Screen 
        name = 'Production' 
        options={{
          title : 'Fiche de production', 
          headerShown : false}}
      />
    </Stack>
  )
}

export default RootLayout;