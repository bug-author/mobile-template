import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { secureStorage, STORAGE_KEYS } from "../lib/secure-storage";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  biometricEnabled: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setBiometricEnabled: (enabled: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      biometricEnabled: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: async (token) => {
        // Store token securely
        if (token) {
          await secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        } else {
          await secureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        }
        set({ token });
      },
      setBiometricEnabled: async (enabled) => {
        await secureStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, enabled.toString());
        set({ biometricEnabled: enabled });
      },
      logout: async () => {
        await secureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        await secureStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Don't persist token in AsyncStorage, use secure storage instead
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        biometricEnabled: state.biometricEnabled,
      }),
    }
  )
);
