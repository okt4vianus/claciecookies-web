// @ts-ignore
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { MapPin } from "lucide-react";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import Mapbox, {
  GeolocateControl,
  type MapRef,
  Marker,
  NavigationControl,
} from "react-map-gl/mapbox";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const INITIAL_VIEW_STATE = {
  latitude: 1.47413677,
  longitude: 124.93459595,
  zoom: 17,
};

export function MapboxView() {
  const [viewport, setViewport] = useState({
    latitude: INITIAL_VIEW_STATE.latitude,
    longitude: INITIAL_VIEW_STATE.longitude,
  });

  const mapRef = useRef<MapRef | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();

    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_ACCESS_TOKEN,
      mapboxgl: mapboxgl,
      marker: true,
      placeholder: "Search address",
    });

    map.addControl(geocoder, "top-left");

    return () => {
      map.removeControl(geocoder);
    };
  }, []);

  return (
    <div>
      <Mapbox
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        style={{ width: 600, height: 400 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onMove={(event) => {
          setViewport((previous) => ({
            ...previous,
            latitude: event.viewState.latitude,
            longitude: event.viewState.longitude,
          }));
        }}
      >
        <NavigationControl />
        <GeolocateControl />
        <Marker
          latitude={viewport.latitude}
          longitude={viewport.longitude}
          anchor="bottom"
        >
          <MapPin className="text-red-700 size-10" />
        </Marker>
      </Mapbox>

      <div className="p-4">
        <pre className="font-mono">
          Lat: {viewport.latitude.toFixed(6)}
          <br />
          Lng: {viewport.longitude.toFixed(6)}
        </pre>
      </div>
    </div>
  );
}
