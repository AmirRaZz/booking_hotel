import { useBookmark } from "@/context/BookmarkListContext";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Loader from "../Loader/Loader";
import { HiArrowLeft } from "react-icons/hi";
import ReactCountryFlag from "react-country-flag";

function SingleBookmark() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBookmark, isLoading, currentBookmark } = useBookmark();

  useEffect(() => {
    getBookmark(id);
  }, [id]);

  if (isLoading || !currentBookmark) return <Loader />;
  return (
    <div>
      <button className="btn btn--back" onClick={() => navigate(-1)}>
        <HiArrowLeft /> Back
      </button>
      <div className="bookmarkItem">
        <ReactCountryFlag svg countryCode={currentBookmark.countryCode} />
        &nbsp; <strong>{currentBookmark.cityName}</strong> &nbsp;
        <span>{currentBookmark.country}</span>
      </div>
    </div>
  );
}

export default SingleBookmark;
