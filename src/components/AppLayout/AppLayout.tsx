import { Outlet } from "react-router";

function AppLayout() {
  return (
    <div className="appLayout">
      <div className="sidebar">
        <Outlet />
      </div>
      <div className="mapContainer">map</div>
    </div>
  );
}

export default AppLayout;
