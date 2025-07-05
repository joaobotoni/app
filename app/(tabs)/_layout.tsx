import { Tabs } from 'expo-router';
import { Globe as Home } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F2F2F7',
          borderTopColor: '#E5E5EA',
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#6C6C70',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Registro',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}