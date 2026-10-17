import { LocationContextProvider } from "@/src/context/LocationContext";
import PointDetailsScreen from "../src/features/stations/PointDetailsScreen";

export default function PointDetailsRoute() {
  return (
    <LocationContextProvider>
      <PointDetailsScreen />
    </LocationContextProvider>
  );
}
