import { MapPin } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import Mapbox, {
  GeolocateControl,
  Marker,
  NavigationControl,
} from "react-map-gl/mapbox";

interface MapboxViewProps {
  mapCoordinates: {
    latitude: number;
    longitude: number;
  };
  isDebug?: boolean;
}

export function MapboxView({
  mapCoordinates,
  isDebug = false,
}: MapboxViewProps) {
  return (
    <div>
      <Mapbox
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          ...mapCoordinates,
          zoom: 16,
        }}
        style={{ width: 700, height: 300 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onMove={
          (event) => {}
          // setMapCoordinates((previous) => ({
          //   ...previous,
          //   latitude: event.viewState.latitude,
          //   longitude: event.viewState.longitude,
          // }))
        }
      >
        <NavigationControl />
        <GeolocateControl />
        <Marker
          latitude={mapCoordinates.latitude}
          longitude={mapCoordinates.longitude}
          anchor="bottom"
        >
          <MapPin className="text-red-700 size-10" />
        </Marker>
      </Mapbox>

      {isDebug && (
        <div className="p-4 py-1">
          <pre>
            Latitude: {mapCoordinates.latitude.toFixed(6)}
            <br />
            Longitude: {mapCoordinates.longitude.toFixed(6)}
          </pre>
        </div>
      )}
    </div>
  );
}
