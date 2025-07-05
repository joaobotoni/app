<<<<<<< HEAD
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from './hooks/useFrameworkReady';
import { ThemeProvider } from './providers/ThemeProvider';
=======
import { useFrameworkReady } from '@/app/hooks/useFrameworkReady';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
>>>>>>> 9609cb93e07a4309d165eb20a6fac0fd1d79eda0

export default function RootLayout() {
  useFrameworkReady();

  return (
<<<<<<< HEAD
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
=======
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
>>>>>>> 9609cb93e07a4309d165eb20a6fac0fd1d79eda0
