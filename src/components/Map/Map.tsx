import { useHotels } from "@/context/HotelProvider";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { useSearchParams } from "react-router";
import useGeoLocation from "@/hooks/useGeoLocation";

function Map() {
  const { hotels } = useHotels();
  const [mapCenter, setMapCenter] = useState<L.LatLngExpression>([
    51.505, -0.09,
  ]);
  const [searchParams] = useSearchParams();
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));

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
        <ChangeCenter position={mapCenter} />
        {hotels.map((item) => (
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
