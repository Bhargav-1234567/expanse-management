import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Layout from "./components/layout";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Friends from "./pages/Friends";
import Account from "./pages/Account";
import Activity from "./pages/Activity";
import PageNotFound from "./pages/PageNotFound";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <SignUp />,
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/friends",
          element: <Friends />,
        },
        {
          path: "/account",
          element: <Account />,
        },
        {
          path: "/activity",
          element: <Activity />,
        },

        {
          path: "*",
          element: <PageNotFound />,
        },
      ],
    },
  ]);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}

export default App;
