import * as Network from "expo-network";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { classifyConnection, readConnectionStatus, type ConnectionStatus } from "../utils/connectivity";

const ConnectivityContext = createContext<{
  status: ConnectionStatus;
  checkConnection: () => Promise<ConnectionStatus>;
} | null>(null);

export function ConnectivityProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<ConnectionStatus>("unknown");
  const latest = useRef<ConnectionStatus>("unknown");
  const revision = useRef(0);
  const active = useRef(false);
  const update = useCallback((next: ConnectionStatus) => {
    latest.current = next;
    if (active.current) setStatus(next);
  }, []);
  const checkConnection = useCallback(async () => {
    const request = ++revision.current;
    const next = await readConnectionStatus(Network.getNetworkStateAsync);
    if (!active.current) return "unknown" as const;
    // Uma leitura anterior não pode sobrescrever um evento de rede mais recente.
    if (request !== revision.current) return latest.current;
    update(next);
    return next;
  }, [update]);

  useEffect(() => {
    active.current = true;
    void checkConnection();
    let network: ReturnType<typeof Network.addNetworkStateListener> | undefined;
    try {
      network = Network.addNetworkStateListener((state) => {
        ++revision.current;
        update(classifyConnection(state));
      });
    } catch {
      // A consulta local continua disponível mesmo sem observador de rede.
      update("unknown");
    }
    const appState = AppState.addEventListener("change", (next) => {
      if (next === "active") void checkConnection();
    });
    return () => {
      active.current = false;
      ++revision.current;
      network?.remove();
      appState.remove();
    };
  }, [checkConnection, update]);

  return <ConnectivityContext.Provider value={{ status, checkConnection }}>{children}</ConnectivityContext.Provider>;
}

export function useConnectivity() {
  const value = useContext(ConnectivityContext);
  if (!value) throw new Error("useConnectivity requer ConnectivityProvider.");
  return value;
}
