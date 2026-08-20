import { Tabs } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";

function Layout () {
  return (
    
    <Tabs
      >
      <Tabs.Screen
        name="Accueil"
        options={{
          title: 'Acceuil',
          tabBarIcon: ({focused}) => 
          (<IconSymbol size={28}
          name="house.fill" color={'#94A3B8'}/>) ,
          headerShown : false }}
      />
      <Tabs.Screen
        name="Historique"
        options={{
          title: 'Historique',
          tabBarIcon: () => <IconSymbol size={28}
          name="clock" color={'#94A3B8'}/>, 
          headerShown : false
        }}
      />
      <Tabs.Screen
        name="Models" 
        options={{
          title: 'Models',
          tabBarIcon: () =>
          <IconSymbol size={28}
          name="list.clipboard.fill" color={'#94A3B8'}/>
          ,headerShown : false }}
          
      />
      <Tabs.Screen
        name="Parameters"
        options={{
          title: 'Paramètres',
          tabBarIcon: () => <IconSymbol size={28}
          name="gearshape" color={'#94A3B8'} />, headerShown : false
        }}
      />
      
    </Tabs>
  )
}

export default Layout;