import { api } from "../lib/axios";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },

  register: async (data: LoginCredentials & { name: string }): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/register", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  refreshToken: async (token: string): Promise<{ token: string }> => {
    const response = await api.post<{ token: string }>("/auth/refresh", { token });
    return response.data;
  },
};
