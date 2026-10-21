import { useEffect } from "react";
import { Platform } from "react-native";
import { ConnectivityProvider } from "../src/context/ConnectivityContext";
import { Stack } from "expo-router";

import {
  PreferencesProvider,
  useAppPreferences,
} from "../src/context/PreferencesContext";

function RootStack() {
  const { theme } = useAppPreferences();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    />
  );
}

export default function Layout() {
  useEffect(() => {
    if (Platform.OS === "web" && !__DEV__ && "serviceWorker" in navigator) {
      // A exportação do Expo inclui o hash do bundle no nome do script.
      // Cada versão prepara suas páginas antes de substituir o cache anterior.
      const entry = document.querySelector<HTMLScriptElement>('script[src*="/_expo/static/js/web/entry-"]');
      const version = entry ? new URL(entry.src).pathname.split("/").pop()! : "v1";
      void navigator.serviceWorker.register(`/offline-worker.js?version=${encodeURIComponent(version)}`, { scope: "/" }).catch(() => {
        // Sem suporte/permissão de cache, a sessão carregada continua utilizável.
      });
    }
  }, []);
  return (
    <PreferencesProvider>
      <ConnectivityProvider>
        <RootStack />
      </ConnectivityProvider>
    </PreferencesProvider>
  );
}
