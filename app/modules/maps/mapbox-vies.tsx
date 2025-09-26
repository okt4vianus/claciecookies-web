import { MapPin } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";
import Mapbox, {
  GeolocateControl,
  Marker,
  NavigationControl,
} from "react-map-gl/mapbox";

const INITIAL_VIEW_STATE = {
  latitude: 1.47413677,
  longitude: 124.93459595,
  zoom: 17,
};

export function MapboxView() {
  const [coords, setCoords] = useState({
    latitude: INITIAL_VIEW_STATE.latitude,
    longitude: INITIAL_VIEW_STATE.longitude,
  });

  return (
    <div>
      <Mapbox
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        initialViewState={INITIAL_VIEW_STATE}
        style={{ width: 600, height: 400 }}
        //   style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onMove={(evt) =>
          setCoords({
            latitude: parseFloat(evt.viewState.latitude.toFixed(8)),
            longitude: parseFloat(evt.viewState.longitude.toFixed(8)),
          })
        }
      >
        <NavigationControl />
        <GeolocateControl />
        <Marker
          latitude={INITIAL_VIEW_STATE.latitude}
          longitude={INITIAL_VIEW_STATE.longitude}
          anchor="bottom"
        >
          <MapPin className="text-red-700 size-10" />
        </Marker>
      </Mapbox>
      {/* koordinat center map */}
      <div className="absolute bottom-2 left-2 px-3 py-1 rounded shadow text-sm font-mono">
        Latitude: {coords.latitude}, Longitude: {coords.longitude}
      </div>
    </div>
  );
}
