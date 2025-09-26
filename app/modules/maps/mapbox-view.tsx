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
  const [markerCoordinates, setMarkerCoordinates] = useState({
    latitude: INITIAL_VIEW_STATE.latitude,
    longitude: INITIAL_VIEW_STATE.longitude,
  });

  return (
    <div>
      <Mapbox
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        initialViewState={INITIAL_VIEW_STATE}
        style={{ width: 600, height: 400 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <NavigationControl />
        <GeolocateControl />
        <Marker
          latitude={markerCoordinates.latitude}
          longitude={markerCoordinates.longitude}
          anchor="bottom"
          draggable
          onDragEnd={(event) => {
            setMarkerCoordinates((previous) => ({
              ...previous,
              latitude: event.lngLat.lat,
              longitude: event.lngLat.lng,
            }));
          }}
        >
          <MapPin className="text-red-700 size-10" />
        </Marker>
      </Mapbox>

      <div className="p-4">
        <pre className="font-mono">
          Lat: {markerCoordinates.latitude.toFixed(6)}
          <br />
          Lng: {markerCoordinates.longitude.toFixed(6)}
        </pre>
      </div>
    </div>
  );
}
