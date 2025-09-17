import { MapPinIcon } from "lucide-react";
import Mapbox, {
  GeolocateControl,
  Marker,
  NavigationControl,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

export function MapboxView() {
  return (
    <Mapbox
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      initialViewState={{
        latitude: 1.474155,
        longitude: 124.934542,
        zoom: 18,
      }}
      style={{ width: 600, height: 400 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      <NavigationControl />
      <GeolocateControl />
      <Marker longitude={124.934542} latitude={1.474155} anchor="bottom">
        <MapPinIcon className="text-red-700 size-10" />
      </Marker>
    </Mapbox>
  );
}
