import { Outlet } from "react-router-dom";

import Header from "../components/Header/Header";
import "../App.css";

const Layout = () => {
  return (
    <main className="app">
      <Header />
      <hr />
      <Outlet />
    </main>
  );
};

export default Layout;
