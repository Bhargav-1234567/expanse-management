import React, { useEffect } from "react";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import { Outlet } from "react-router-dom";
import "./layout.css";
import AddExpenseModel from "../common/AddExpenseModel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import { calculateOwesAndOwed } from "../../redux/slices/expensesSlice";

const Layout = () => {
  const currentUser = useSelector((state) => state.users.currentUser);
  const dispatch = useDispatch();
  const { navigate, params, addQueryParam } = useCustomNavigation();
  useEffect(() => {
    dispatch(calculateOwesAndOwed({ userId: currentUser?.userId }));
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate, dispatch]);
  return (
    <div className="layout-container">
      <AppHeader />
      {params.addExpanse && <AddExpenseModel />}
      <button
        className="btn-filled add-expanse-button"
        onClick={() => addQueryParam("addExpanse", "true")}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <Outlet />
      <AppFooter />
    </div>
  );
};

export default Layout;
