import { Outlet } from "react-router-dom";
import { Header, Footer, Parent, ErrorBoundary } from "../components/index";
export default function Layout() {
  return (
    <Parent>
      <Header />{" "}
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>{" "}
      <Footer />
    </Parent>
  );
}
