export type AskedPlace = {
  name: string;
  category: string;
  latitude: number;
  longitude: number;
};

export type NearbyPlace = AskedPlace & {
  address: string;
  rating: number;
  powerKw: number | null;
  status: string;
  openingHours: string;
  distanceKm: number;
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

export async function fetchNearbyPlaces(input: {
  category: string;
  latitude: number;
  longitude: number;
}): Promise<NearbyPlace[]> {
  const base =
    process.env.EXPO_PUBLIC_FLUI_AI_API_URL ?? "http://localhost:3000";
  const params = new URLSearchParams({
    category: input.category,
    latitude: String(input.latitude),
    longitude: String(input.longitude),
  });

  try {
    const response = await fetch(
      `${base.replace(/\/$/, "")}/places?${params.toString()}`,
    );
    const body: unknown = await response.json().catch(() => null);
    if (!response.ok || !Array.isArray(body)) return [];
    return body.flatMap((item) => {
      const place = readNearbyPlace(item);
      return place ? [place] : [];
    });
  } catch {
    return [];
  }
}

function readNearbyPlace(value: unknown): NearbyPlace | null {
  if (!value || typeof value !== "object") return null;
  const place = value as Record<string, unknown>;
  if (typeof place.name !== "string" || typeof place.category !== "string") {
    return null;
  }
  if (
    typeof place.latitude !== "number" ||
    typeof place.longitude !== "number" ||
    !Number.isFinite(place.latitude) ||
    !Number.isFinite(place.longitude)
  ) {
    return null;
  }

  return {
    name: place.name,
    category: place.category,
    latitude: place.latitude,
    longitude: place.longitude,
    address: typeof place.address === "string" ? place.address : "",
    rating: typeof place.rating === "number" ? place.rating : 0,
    powerKw: typeof place.powerKw === "number" ? place.powerKw : null,
    status: typeof place.status === "string" ? place.status : "",
    openingHours:
      typeof place.openingHours === "string" ? place.openingHours : "",
    distanceKm: typeof place.distanceKm === "number" ? place.distanceKm : 0,
  };
}
