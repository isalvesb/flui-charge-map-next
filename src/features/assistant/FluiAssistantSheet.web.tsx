import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

import type { FluiAssistantSheetProps } from "./FluiAssistantOverlay";

export function FluiAssistantSheet(props: FluiAssistantSheetProps) {
  if (!props.visible) return null;
  return (
    <WithSkiaWeb
      getComponent={() => import("./FluiAssistantOverlay")}
      componentProps={props}
      opts={{ locateFile: () => "/canvaskit.wasm" }}
      fallback={null}
    />
  );
}

export type { FluiAssistantSheetProps } from "./FluiAssistantOverlay";
