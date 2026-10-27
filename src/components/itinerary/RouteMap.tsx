"use client";

import { useEffect, useRef } from "react";
import type { Map as MlMap, GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Itinerary } from "@/lib/types";
import { DAY_COLOURS } from "./format";

// Free vector tiles, no API key. Lines between places are straight segments
// along the route's waypoints, not road-accurate traces.
const STYLE = "https://tiles.openfreemap.org/styles/positron";
const DRAW_MS = 2600;

function routeCoords(it: Itinerary) {
  const coords: [number, number][] = [];
  for (const d of it.days) {
    // Plans saved before legs carried coordinates fall back to the day's stops.
    const dayCoords = d.legs.every((l) => l.coords)
      ? d.legs.flatMap((l) => l.coords)
      : [d.startAt, ...d.stops, d.overnight].map((p) => [p.lng, p.lat] as [number, number]);
    for (const c of dayCoords) {
      const last = coords[coords.length - 1];
      if (!last || last[0] !== c[0] || last[1] !== c[1]) coords.push(c);
    }
  }
  return coords;
}

function nights(it: Itinerary) {
  return {
    type: "FeatureCollection" as const,
    features: it.days.map((d) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [d.overnight.lng, d.overnight.lat] },
      properties: {
        label: d.isLastDay ? `End · ${d.overnight.name}` : `${d.day} · ${d.overnight.name}`,
        colour: DAY_COLOURS[(d.day - 1) % DAY_COLOURS.length],
      },
    })),
  };
}

// Interpolated prefix of a polyline, so the line grows smoothly.
function partial(coords: [number, number][], t: number): [number, number][] {
  if (coords.length < 2) return coords;
  const seg = t * (coords.length - 1);
  const i = Math.floor(seg);
  const f = seg - i;
  const out = coords.slice(0, i + 1);
  if (i < coords.length - 1) {
    const [a, b] = [coords[i], coords[i + 1]];
    out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
  }
  return out;
}

export function RouteMap({ itinerary, className = "" }: { itinerary: Itinerary; className?: string }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<MlMap | null>(null);
  const ready = useRef<Promise<void> | null>(null);

  useEffect(() => {
    let cancelled = false;
    ready.current = (async () => {
      const { Map, NavigationControl, setWorkerUrl } = await import("maplibre-gl");
      if (cancelled || !el.current) return;
      setWorkerUrl("/maplibre/maplibre-gl-worker.mjs"); // copied by scripts/copy-maplibre-worker.mjs
      const m = new Map({
        container: el.current,
        style: STYLE,
        center: [88.5, 27.4],
        zoom: 7.4,
        attributionControl: { compact: true },
        cooperativeGestures: true,
      });
      m.addControl(new NavigationControl({ showCompass: false }), "top-right");
      map.current = m;
      await new Promise<void>((resolve) => m.once("load", () => resolve()));
      m.addSource("route", { type: "geojson", data: { type: "Feature", geometry: { type: "LineString", coordinates: [] }, properties: {} } });
      m.addSource("nights", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
      m.addLayer({ id: "route-casing", type: "line", source: "route", paint: { "line-color": "#fbfbfa", "line-width": 7 }, layout: { "line-cap": "round", "line-join": "round" } });
      m.addLayer({ id: "route", type: "line", source: "route", paint: { "line-color": "#7a1f2b", "line-width": 3.5 }, layout: { "line-cap": "round", "line-join": "round" } });
      m.addLayer({
        id: "nights",
        type: "circle",
        source: "nights",
        paint: { "circle-radius": 6, "circle-color": ["get", "colour"], "circle-stroke-color": "#1b2422", "circle-stroke-width": 1.2 },
      });
      m.addLayer({
        id: "night-labels",
        type: "symbol",
        source: "nights",
        layout: { "text-field": ["get", "label"], "text-font": ["Noto Sans Regular"], "text-size": 12, "text-offset": [0, 1.2], "text-anchor": "top", "text-optional": true },
        paint: { "text-color": "#1b2422", "text-halo-color": "#fbfbfa", "text-halo-width": 1.5 },
      });
    })();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    let stopped = false;
    (async () => {
      await ready.current;
      const m = map.current;
      if (!m || stopped) return;
      const coords = routeCoords(itinerary);
      if (!coords.length) return;
      (m.getSource("nights") as GeoJSONSource).setData(nights(itinerary));

      const lngs = coords.map((c) => c[0]);
      const lats = coords.map((c) => c[1]);
      m.fitBounds(
        [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ],
        { padding: 48, duration: 800, maxZoom: 10 },
      );

      const route = m.getSource("route") as GeoJSONSource;
      const set = (c: [number, number][]) => route.setData({ type: "Feature", geometry: { type: "LineString", coordinates: c }, properties: {} });
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        set(coords);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DRAW_MS);
        set(partial(coords, 1 - Math.pow(1 - t, 3)));
        if (t < 1 && !stopped) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    })();
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
    };
  }, [itinerary]);

  return <div ref={el} className={`overflow-hidden ${className}`} role="img" aria-label={`Route map: ${itinerary.title}`} />;
}
