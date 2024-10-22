import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {
  faUser,
  faUserGroup,
  faBoxesStacked,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

const AppFooter = () => {
  return (
    <div className="nav-bar">
      <NavLink to={"/"}>
        <FontAwesomeIcon icon={faBoxesStacked} />
        Home
      </NavLink>
      <NavLink to={"/friends"}>
        <FontAwesomeIcon icon={faUserGroup} />
        Friends
      </NavLink>

      <NavLink to={"/activity"}>
        <FontAwesomeIcon icon={faChartLine} />
        Activity
      </NavLink>
      <NavLink to={"/account"}>
        <FontAwesomeIcon icon={faUser} />
        Account
      </NavLink>
    </div>
  );
};

export default AppFooter;
