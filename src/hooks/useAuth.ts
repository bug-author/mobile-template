import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth.store";
import { authService } from "../services/auth.service";
import { identifyUser, clearUser } from "../lib/sentry";

export const useAuth = () => {
  const { user, token, isAuthenticated, setUser, setToken, logout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.token);
      // Identify user in Sentry
      identifyUser(data.user.id, data.user.email, data.user.name);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.token);
      // Identify user in Sentry
      identifyUser(data.user.id, data.user.email, data.user.name);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logout();
      // Clear user from Sentry
      clearUser();
    },
  });

  return {
    user,
    token,
    isAuthenticated,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};
