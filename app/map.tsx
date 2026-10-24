import HomeMapScreen from "../src/features/map/HomeMapScreen";
import { Map } from "../src/features/map/map/Map";

export default function MapRoute() {
  return (
    <Map.Provider>
      <HomeMapScreen />
    </Map.Provider>
  );
}
