import React, { useMemo } from "react";
import { View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { create } from "qrcode";

type Props = {
  valor: string;
  tamanho: number;
};

// QR sempre escuro sobre fundo claro, independente do tema, para leitura nos totens.
const COR_QR = "#1C1526";
const COR_FUNDO = "#FFFFFF";
const MARGEM_MODULOS = 4;

export function QrCode({ valor, tamanho }: Props) {
  const matriz = useMemo(() => {
    const qr = create(valor, { errorCorrectionLevel: "M" });
    const tamanhoMatriz = qr.modules.size;
    const celulas: { x: number; y: number }[] = [];

    for (let y = 0; y < tamanhoMatriz; y += 1) {
      for (let x = 0; x < tamanhoMatriz; x += 1) {
        if (qr.modules.get(y, x)) {
          celulas.push({ x, y });
        }
      }
    }

    return { tamanho: tamanhoMatriz, celulas };
  }, [valor]);

  const total = matriz.tamanho + MARGEM_MODULOS * 2;

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={`QR code do voucher ${valor}`}>
      <Svg width={tamanho} height={tamanho} viewBox={`0 0 ${total} ${total}`}>
        <Rect x={0} y={0} width={total} height={total} fill={COR_FUNDO} />
        {matriz.celulas.map(({ x, y }) => (
          <Rect
            key={`${x}-${y}`}
            x={x + MARGEM_MODULOS}
            y={y + MARGEM_MODULOS}
            width={1}
            height={1}
            fill={COR_QR}
          />
        ))}
      </Svg>
    </View>
  );
}
