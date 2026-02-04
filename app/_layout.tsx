import React, { useEffect } from 'react';
import { Pressable, BackHandler } from 'react-native';
import { Stack, useRouter, useNavigation, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';
import { ErrorBoundary, ToastProvider, Toast, CartIcon } from '@shared/components';
import { QUERY_CONFIG } from '@shared/constants';
import { theme } from '@design-system/theme';

/**
 * Custom back button that handles deep link navigation.
 * When there's no navigation history (e.g., entering via deep link),
 * navigates to home instead of doing nothing.
 */
const SmartBackButton: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const handlePress = (): void => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <Pressable onPress={handlePress} hitSlop={8} style={{ marginLeft: -8 }}>
      <Ionicons name="arrow-back" size={24} color={theme.colors.neutral.white} />
    </Pressable>
  );
};

/**
 * Handles Android hardware back button for deep link scenarios.
 * When on a non-home screen without navigation history, goes to home instead of exiting.
 */
const useSmartBackHandler = (): void => {
  const router = useRouter();
  const navigation = useNavigation();
  const segments = useSegments();

  useEffect(() => {
    const isHomeScreen = segments.length === 0 || (segments.length === 1 && segments[0] === '(index)');

    const onBackPress = (): boolean => {
      if (isHomeScreen) {
        // On home screen, let the default behavior (exit app) happen
        return false;
      }

      if (navigation.canGoBack()) {
        router.back();
      } else {
        // No history (entered via deep link), go to home
        router.replace('/');
      }
      return true; // Prevent default behavior
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [navigation, router, segments]);
};

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
  // Handle Android hardware back button for deep link scenarios
  useSmartBackHandler();

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
              <Stack.Screen
                name="products/[id]"
                options={{
                  title: 'Detalhes do Produto',
                  headerLeft: () => <SmartBackButton />,
                }}
              />
              <Stack.Screen
                name="cart"
                options={{
                  title: 'Carrinho',
                  headerLeft: () => <SmartBackButton />,
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
