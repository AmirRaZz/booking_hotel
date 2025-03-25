import { Outlet } from "react-router";
import Map from "../Map/Map";
function AppLayout() {
  return (
    <div className="appLayout">
      <div className="sidebar">
        <Outlet />
      </div>
      <div className="mapContainer">
        <Map />
      </div>
    </div>
  );
}

export default AppLayout;
