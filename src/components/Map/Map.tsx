import { useHotels } from "@/context/HotelProvider";

function Map() {
  const { hotels, isLoading } = useHotels();
  return <div className="mapContainer">map</div>;
}

export default Map;
