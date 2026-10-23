import RewardsScreen from "@/src/features/rewards/RewardsScreen";
import { RECOMPENSAS_ENABLED } from "@/src/features/rewards/flag";
import { Redirect } from "expo-router";

export default function RewardsRoute() {
  // Com flag desligada, a rota não é acessível (inclusive por URL no web).
  if (!RECOMPENSAS_ENABLED) {
    return <Redirect href="/map" />;
  }
  return <RewardsScreen />;
}
