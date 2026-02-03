import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Animated } from 'react-native';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastMessage['type'], duration?: number) => void;
  hideToast: () => void;
  currentToast: ToastMessage | null;
  opacity: Animated.Value;
  translateY: Animated.Value;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentToast, setCurrentToast] = useState<ToastMessage | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-100)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentToast(null);
    });
  }, [opacity, translateY]);

  const showToast = useCallback(
    (message: string, type: ToastMessage['type'] = 'success', duration = 3000) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const id = Date.now().toString();
      setCurrentToast({ id, message, type, duration });

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
        }),
      ]).start();

      timeoutRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    },
    [opacity, translateY, hideToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, hideToast, currentToast, opacity, translateY }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
