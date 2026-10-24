import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

// Documento da exportação web; não participa das telas nativas.
export default function Html({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>Flui | Demonstração NEXT 2026</title>
        <meta name="description" content="Explore a demonstração do Flui. Estações e disponibilidade demonstrativas, com estimativas sem telemetria e prévia esquemática do mapa." />
        <meta name="robots" content="noindex, nofollow" />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
