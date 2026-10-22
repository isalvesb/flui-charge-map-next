import React from "react";
import { EnergyOrb } from "./EnergyOrb";
import type { ReacticxOrbProps } from "./MapEnergyOrb.types";
// Web/SSR: preview SVG sem carregar CanvasKit; o shader real é nativo.
export function MapEnergyOrb(props: ReacticxOrbProps) { return <EnergyOrb {...props} />; }
