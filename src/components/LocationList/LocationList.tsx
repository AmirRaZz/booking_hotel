import SkeletonLoader from "@/components/Loader/SkeletonLoader";
import { useHotels } from "@/context/HotelProvider";

function LocationList() {
  const { hotels,isLoading } = useHotels();
  return (
    <div className="nearbyLocation">
      <h2>Nearby Locations</h2>
      <div className="locationList">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          hotels.map((item) => {
            return (
              <div className="locationItem" key={item.id}>
                <div className="imageWrapper">
                  <img
                    src={item.picture_url.url}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/600x400?text=Image+Not+Available";
                    }}
                  />
                </div>
                <div className="locationItemDesc">
                  <p className="location">{item.smart_location}</p>
                  <p className="name">{item.name}</p>
                  <p className="price">
                    ₹&nbsp;{item.price}&nbsp;
                    <span>per night</span>
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default LocationList;
