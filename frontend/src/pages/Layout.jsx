import { Outlet } from "react-router-dom";
import { Header, Footer, Parent } from "../components/index";
export default function Layout() {
  return (
    <Parent>
      <Header />
      <Outlet />
      <Footer />
    </Parent>
  );
}
