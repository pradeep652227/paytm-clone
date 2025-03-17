import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import * as Pages from "./pages/index";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Pages.Layout />}>
        <Route path="signup" element={<Pages.Signup />} />
        <Route path="signin" element={<Pages.Signin />} />

        {/* Protected Routes */}
        <Route element={<Pages.ProtectedRoute />}>
          <Route path="dashboard" element={<Pages.Dashboard />} />
          <Route path="/" element={<Pages.Home />} />
          <Route path="send" element={<Pages.SendMoney />} />
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
