import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_KEY = "app-language";

const resources = {
  en: {
    translation: {
      common: {
        cancel: "Cancel",
        confirm: "Confirm",
        save: "Save",
        delete: "Delete",
        edit: "Edit",
        back: "Back",
        next: "Next",
        loading: "Loading...",
        error: "Error",
        success: "Success",
      },
      auth: {
        signIn: "Sign In",
        signUp: "Sign Up",
        signOut: "Sign Out",
        email: "Email",
        password: "Password",
        name: "Name",
        forgotPassword: "Forgot Password?",
        dontHaveAccount: "Don't have an account?",
        alreadyHaveAccount: "Already have an account?",
        invalidCredentials: "Invalid credentials",
        registrationFailed: "Registration failed",
      },
      home: {
        welcome: "Welcome",
        title: "Mobile App Template",
        description: "Please sign in to continue",
      },
      profile: {
        title: "Profile",
        name: "Name",
        email: "Email",
      },
      errors: {
        somethingWentWrong: "Oops! Something went wrong",
        errorReported: "The error has been reported to our team.",
        tryAgain: "Try Again",
      },
      network: {
        offline: "You are offline",
        online: "Back online",
      },
    },
  },
  es: {
    translation: {
      common: {
        cancel: "Cancelar",
        confirm: "Confirmar",
        save: "Guardar",
        delete: "Eliminar",
        edit: "Editar",
        back: "Atrás",
        next: "Siguiente",
        loading: "Cargando...",
        error: "Error",
        success: "Éxito",
      },
      auth: {
        signIn: "Iniciar Sesión",
        signUp: "Registrarse",
        signOut: "Cerrar Sesión",
        email: "Correo Electrónico",
        password: "Contraseña",
        name: "Nombre",
        forgotPassword: "¿Olvidaste tu contraseña?",
        dontHaveAccount: "¿No tienes una cuenta?",
        alreadyHaveAccount: "¿Ya tienes una cuenta?",
        invalidCredentials: "Credenciales inválidas",
        registrationFailed: "Registro fallido",
      },
      home: {
        welcome: "Bienvenido",
        title: "Plantilla de Aplicación Móvil",
        description: "Por favor inicia sesión para continuar",
      },
      profile: {
        title: "Perfil",
        name: "Nombre",
        email: "Correo Electrónico",
      },
      errors: {
        somethingWentWrong: "¡Ups! Algo salió mal",
        errorReported: "El error ha sido reportado a nuestro equipo.",
        tryAgain: "Intentar de Nuevo",
      },
      network: {
        offline: "Estás sin conexión",
        online: "De vuelta en línea",
      },
    },
  },
};

const initI18n = async () => {
  const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);

  await i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    resources,
    lng: savedLanguage || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

export const changeLanguage = async (language: string) => {
  await AsyncStorage.setItem(LANGUAGE_KEY, language);
  await i18n.changeLanguage(language);
};

initI18n();

export default i18n;
