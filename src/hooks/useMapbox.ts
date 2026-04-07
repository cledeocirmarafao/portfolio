import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface UseMapboxOptions {
  center: [number, number];
  zoom: number;
  style?: string;
  markerColor?: { from: string; to: string };
}

export const useMapbox = ({
  center,
  zoom,
  style = "mapbox://styles/mapbox/dark-v11",
  markerColor,
}: UseMapboxOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style,
      center,
      zoom,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    const from = markerColor?.from ?? "#00f5ff";
    const to = markerColor?.to ?? "#ff00aa";

    const markerEl = document.createElement("div");
    markerEl.innerHTML = `
    <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,${from}80,${to}4d);animation:pulseMarker 2s ease-in-out infinite;"></div>
        <div style="width:14px;height:14px;border-radius:50%;background:linear-gradient(135deg,${from},${to});box-shadow:0 0 12px ${from},0 0 24px ${to};z-index:1;"></div>
    </div>`;

    new mapboxgl.Marker({ element: markerEl }).setLngLat(center).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return { containerRef, mapRef };
};
