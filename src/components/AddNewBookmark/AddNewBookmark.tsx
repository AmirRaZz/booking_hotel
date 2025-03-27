import useUrlLocation from "@/hooks/useUrlLocation";
import axios from "axios";
import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router";
import Loader from "../Loader/Loader";
import ReactCountryFlag from "react-country-flag";
import { useBookmark } from "@/context/BookmarkListContext";

// function getFlagEmoji(countryCode: string) {
//   const codePoints = countryCode
//     .toUpperCase()
//     .split("")
//     .map((char) => 127397 + char.charCodeAt(0));
//   return String.fromCodePoint(...codePoints);
// }

const BASE_GEOCODING_URL =
  "https://api.bigdatacloud.net/data/reverse-geocode-client";

function AddNewBookmark() {
  const navigate = useNavigate();
  const [lat, lng] = useUrlLocation();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const { createBookmark } = useBookmark();

  useEffect(() => {
    if (!lat || !lng) return;
    async function fetchLocationData() {
      setIsLoadingGeocoding(true);
      setGeocodingError(null);
      try {
        const { data } = await axios.get(
          `${BASE_GEOCODING_URL}?latitude=${lat}&longitude=${lng}`
        );
        if (!data.countryCode) {
          throw new Error(
            "This location is not a city! Please click somewhere else."
          );
        }

        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setCountryCode(data.countryCode);
      } catch (error: unknown) {
        setGeocodingError(
          error instanceof Error ? error.message : "An error occurred"
        );
      } finally {
        setIsLoadingGeocoding(false);
      }
    }
    fetchLocationData();
  }, [lat, lng]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cityName || !country) return;

    const newBookmark = {
      cityName,
      country,
      countryCode,
      latitude: lat.toString(),
      longitude: lng.toString(),
      host_location: `${cityName} ${country}`,
    };
    await createBookmark(newBookmark);
    navigate("/bookmark");
  };

  if (isLoadingGeocoding) return <Loader />;
  if (geocodingError) return <strong>{geocodingError}</strong>;

  return (
    <div>
      <h2>Bookmark New Location</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="formControl">
          <label htmlFor="cityName">City Name</label>
          <input
            type="text"
            id="cityName"
            name="cityName"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
          />
        </div>
        <div className="formControl">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <ReactCountryFlag className="flag" countryCode={countryCode} svg />
          {/* <span className="flag">{countryCode}</span> */}
        </div>
        <div className="buttons">
          <button
            className="btn btn--back"
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
          >
            <HiArrowLeft /> Back
          </button>
          <button className="btn btn--primary">Add</button>
        </div>
      </form>
    </div>
  );
}

export default AddNewBookmark;
