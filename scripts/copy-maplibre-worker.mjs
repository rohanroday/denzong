// MapLibre loads its web worker from a URL next to its own module, which
// Turbopack doesn't serve. Copy the (self-contained) worker into public/ and
// point MapLibre at it with setWorkerUrl. Runs on install and before dev/build.
import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync("public/maplibre", { recursive: true });
copyFileSync("node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs", "public/maplibre/maplibre-gl-worker.mjs");
