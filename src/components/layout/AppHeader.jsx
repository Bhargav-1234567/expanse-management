import {
  faCircleArrowLeft,
  faCircleChevronLeft,
  faUndo,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useLocation } from "react-router-dom";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import { useSelector } from "react-redux";

const AppHeader = () => {
  const location = useLocation();
  const currentUser = useSelector((state) => state.users.currentUser);
  const { navigate } = useCustomNavigation();
  return (
    <div className="header-container">
      <div className="align-items-center d-flex gap-2">
        <FontAwesomeIcon
          onClick={() => navigate(-1)}
          icon={faCircleChevronLeft}
          className="cursor-pointer"
        />
        <h6 className="align-items-center d-flex justify-content-center mb-0">
          {location.pathname.split("/")[1]
            ? location.pathname.split("/")[1].toUpperCase()
            : "HOME"}
        </h6>
      </div>
      <div className="align-items-center d-flex gap-2">
        <div className="profile">
          <FontAwesomeIcon icon={faUser} />
        </div>
        <div>{currentUser?.username}</div>
      </div>
    </div>
  );
};

export default AppHeader;
