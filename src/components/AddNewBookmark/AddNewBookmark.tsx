import useUrlLocation from "@/hooks/useUrlLocation";
import { HiArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router";

function AddNewBookmark() {
  const navigate = useNavigate();
  const [lat, lng] = useUrlLocation();

  return (
    <div>
      <h2>Bookmark New Location</h2>
      <form className="form">
        <div className="formControl">
          <label htmlFor="cityName">City Name</label>
          <input type="text" id="cityName" name="cityName" />
        </div>
        <div className="formControl">
          <label htmlFor="country">Country</label>
          <input type="text" id="country" name="country" />
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
