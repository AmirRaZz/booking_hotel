import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router";
import useGeoLocation from "@/hooks/useGeoLocation";
import { HotelType } from "@/types/hotel";
import useUrlLocation from "@/hooks/useUrlLocation";

function Map({ markerLocations }: { markerLocations: HotelType[] }) {
  const [mapCenter, setMapCenter] = useState<L.LatLngExpression>([
    51.505, -0.09,
  ]);
  const [lat, lng] = useUrlLocation();

  const {
    isLoading,
    position: geoLocationPosition,
    getPosition,
  } = useGeoLocation();

  useEffect(() => {
    if (lat && lng) setMapCenter([lat, lng]);
  }, [lat, lng]);

  useEffect(() => {
    if ("lat" in geoLocationPosition && "lng" in geoLocationPosition) {
      setMapCenter([
        Number(geoLocationPosition.lat),
        Number(geoLocationPosition.lng),
      ]);
    }
  }, [geoLocationPosition]);

  return (
    <div className="mapContainer">
      <MapContainer
        className="map"
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
      >
        <button onClick={getPosition} className="getLocation">
          {isLoading ? "Loading..." : "Use Your Location"}
        </button>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <DetectClick />
        <ChangeCenter position={mapCenter} />
        {markerLocations.map((item) => (
          <Marker
            key={item.id}
            position={[Number(item.latitude), Number(item.longitude)]}
          >
            <Popup>{item.host_location}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;

function ChangeCenter({ position }: { position: L.LatLngExpression }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvent("click", (e: L.LeafletMouseEvent) =>
    navigate(`/bookmark/add?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
  );
  return null;
}
