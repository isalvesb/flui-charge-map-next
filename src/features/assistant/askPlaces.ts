export type AskedPlace = {
  name: string;
  category: string;
  latitude: number;
  longitude: number;
};

export async function askPlaces(input: {
  text: string;
  latitude: number;
  longitude: number;
}): Promise<
  { ok: true; places: AskedPlace[] } | { ok: false; message: string }
> {
  const base =
    process.env.EXPO_PUBLIC_FLUI_AI_API_URL ?? "http://localhost:3000";

  try {
    const response = await fetch(`${base.replace(/\/$/, "")}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const body: unknown = await response.json().catch(() => null);
    if (response.ok && Array.isArray(body)) {
      return { ok: true, places: body as AskedPlace[] };
    }
    const message =
      body &&
      typeof body === "object" &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : "A busca falhou.";
    return { ok: false, message };
  } catch {
    return { ok: false, message: "Não consegui falar com a FluIA." };
  }
}
