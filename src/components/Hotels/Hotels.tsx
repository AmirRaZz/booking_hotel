import useFetch from "@/hooks/useFetch";
import { Link, useSearchParams } from "react-router";
import SkeletonLoader from "../Loader/SkeletonLoader";

function Hotels() {
  const [searchParams, setSearchParams] = useSearchParams();
  const destination = searchParams.get("destination") || "";
  const room = JSON.parse(searchParams.get("options") || "[]").room;
  const { data, isLoading } = useFetch(
    "http://localhost:5000/hotels",
    `q=${destination || ""}&accommodates_gte=${room || 1}`
  );

  if (isLoading) {
    return (
      <div className="searchList">
        <h2>Search Results</h2>
        <div className="hotelSkeletonContainer">
          <SkeletonLoader count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="searchList">
      <h2>Search Results ({data.length})</h2>
      {data.map((item) => {
        return (
          <Link
            to={`/hotels/${item.id}?lat=${item.latitude}&lng=${item.longitude}`}
            key={item.id}
            className="hotel-link"
          >
            <div className="searchItem">
              <img
                src={item.picture_url.url}
                alt={item.name}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/600x400?text=Image+Not+Available";
                }}
              />
              <div className="searchItemDesc">
                <p className="location">{item.smart_location}</p>
                <p className="name">{item.name}</p>
                <p className="price">
                  ₹&nbsp;{item.price}&nbsp;
                  <span>per night</span>
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default Hotels;
