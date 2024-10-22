import React from "react";
import { logout } from "../../redux/slices/usersSlice";
import { useDispatch } from "react-redux";

const Layout = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <button onClick={() => dispatch(logout())}>logout</button>
    </div>
  );
};

export default Layout;
