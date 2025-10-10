import { MapPin } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import Mapbox, {
  GeolocateControl,
  Marker,
  NavigationControl,
} from "react-map-gl/mapbox";
import type { ConformControl } from "../form/type";

interface MapboxViewProps {
  isDebug?: boolean;
  latitudeControl: ConformControl;
  longitudeControl: ConformControl;
}

export function MapboxView({
  isDebug = false,
  latitudeControl,
  longitudeControl,
}: MapboxViewProps) {
  const mapCoordinates = {
    latitude: Number(latitudeControl.value),
    longitude: Number(longitudeControl.value),
    zoom: 16,
  };

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
        onMove={(event) => {
          // TODO: Function to pass in here to get the value
          // changeCoordinates(event.viewState)
          latitudeControl.change(event.viewState.latitude.toString());
          longitudeControl.change(event.viewState.longitude.toString());
        }}
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
