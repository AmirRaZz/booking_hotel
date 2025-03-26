import { useHotels } from "@/context/HotelProvider";
import { useEffect } from "react";
import { useParams } from "react-router";
import Loader from "../Loader/Loader";

function SingleHotel() {
  const { id } = useParams();
  const { getHotel, isLoadingCurrentHotel, currentHotel } = useHotels();

  useEffect(() => {
    getHotel(id);
  }, [id]);

  if (isLoadingCurrentHotel) return <Loader />;

  return (
    <div className="room">
      <div className="roomDetail">
        <h2>{currentHotel?.name}</h2>
        <div>
          {currentHotel?.number_of_reviews} reviews &bull;
          {currentHotel?.smart_location}
        </div>
        <img
          src={
            currentHotel?.xl_picture_url ||
            "https://placehold.co/600x400?text=Image+Not+Available"
          }
          alt={currentHotel?.name || "Hotel"}
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/600x400?text=Image+Not+Available";
          }}
        />
      </div>
    </div>
  );
}

export default SingleHotel;
