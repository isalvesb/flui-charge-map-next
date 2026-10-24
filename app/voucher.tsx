import { Redirect } from "expo-router";
import VoucherScreen from "../src/features/rewards/VoucherScreen";
import { RECOMPENSAS_ENABLED } from "../src/features/rewards/flag";

export default function VoucherRoute() {
  // Com a flag desligada, a rota não é acessível (inclusive por URL no web).
  if (!RECOMPENSAS_ENABLED) {
    return <Redirect href="/map" />;
  }
  return <VoucherScreen />;
}
