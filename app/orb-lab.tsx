import React from "react";
import { Redirect } from "expo-router";
import OrbLabScreen from "../src/features/assistant/OrbLabScreen";

export default function OrbLabRoute() {
  return __DEV__ ? <OrbLabScreen /> : <Redirect href="/settings" />;
}
