import useFetch from "@/hooks/useFetch";
import SkeletonLoader from "@/components/Loader/SkeletonLoader";

function LocationList() {
  const { data, isLoading } = useFetch("http://localhost:5000/hotels", "");

  return (
    <div className="nearbyLocation">
      <h2>Nearby Locations</h2>
      <div className="locationList">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          data.map((item) => {
            return (
              <div className="locationItem" key={item.id}>
                <div className="imageWrapper">
                  <img src={item.picture_url.url} alt={item.name} />
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
