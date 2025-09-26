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
        // onMove={(evt) =>
        //   setCoords({
        //     latitude: parseFloat(evt.viewState.latitude.toFixed(8)),
        //     longitude: parseFloat(evt.viewState.longitude.toFixed(8)),
        //   })
        onMove={(evt) =>
          setCoords((prev) => ({
            ...prev,
            latitude: evt.viewState.latitude,
            longitude: evt.viewState.longitude,
            //     latitude: parseFloat(evt.viewState.latitude.toFixed(8)),
            //     longitude: parseFloat(evt.viewState.longitude.toFixed(8)),
            zoom: evt.viewState.zoom,
          }))
        }
      >
        <NavigationControl />
        <GeolocateControl />
        <Marker
          latitude={INITIAL_VIEW_STATE.latitude}
          longitude={INITIAL_VIEW_STATE.longitude}
          anchor="bottom"
          draggable
          onDragEnd={(evt) => {
            setCoords((prev) => ({
              ...prev,
              latitude: evt.lngLat.lat,
              longitude: evt.lngLat.lng,
            }));
          }}
        >
          <MapPin className="text-red-700 size-10" />
        </Marker>
      </Mapbox>

      <div className="p-4">
        <pre className="font-mono">
          Lat: {coords.latitude.toFixed(6)}
          <br />
          Lng: {coords.longitude.toFixed(6)}
        </pre>
      </div>
    </div>
  );
}
