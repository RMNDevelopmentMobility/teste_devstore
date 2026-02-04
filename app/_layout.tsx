import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { ErrorBoundary, ToastProvider, Toast, CartIcon } from '@shared/components';
import { QUERY_CONFIG } from '@shared/constants';
import { theme } from '@design-system/theme';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const SPLASH_DURATION_MS = 2000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: QUERY_CONFIG.STALE_TIME,
    },
  },
});

const headerStyle = {
  backgroundColor: theme.colors.primary.main,
};

const headerTintColor = theme.colors.neutral.white;

export default function RootLayout(): React.ReactElement {
  useEffect(() => {
    const hideSplash = async (): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, SPLASH_DURATION_MS));
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <StatusBar style="light" translucent={false} backgroundColor={theme.colors.primary.main} />
            <Stack
              screenOptions={{
                headerShown: true,
                headerStyle,
                headerTintColor,
                headerTitleStyle: { fontWeight: '600' },
                headerRight: () => <CartIcon />,
              }}
            >
              <Stack.Screen name="index" options={{ title: 'DevStore', headerBackVisible: false }} />
              <Stack.Screen name="products/[id]" options={{ title: 'Detalhes do Produto' }} />
              <Stack.Screen
                name="cart"
                options={{
                  title: 'Carrinho',
                  headerRight: () => null,
                }}
              />
            </Stack>
            <Toast />
          </ToastProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
