
import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

// Lazy load components for better performance
const MyBookings = lazy(() => import("./components/MyBookings"));
const Support = lazy(() => import("./components/Support"));
// const SignIn = lazy(() => import("./components/SignIn"));
const Register = lazy(() => import("./components/Register"));
const Login = lazy(() => import("./components/Login"));
const TicketBooking = lazy(() => import("./components/TicketBooking"));

// Admin components
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const Dashboard = lazy(() => import("./components/admin/Dashboard"));
const BusManagement = lazy(() => import("./components/admin/Bus_management/BusManagement"));
const RouteManagement = lazy(
  () => import("./components/admin/Route_management/RouteManagement"),
);
const ScheduleManagement = lazy(
  () => import("./components/admin/Schedule_management/ScheduleManagement"),
);
const UserManagement = lazy(() => import("./components/admin/User_management/UserManagement"));
const AdminProfile = lazy(() => import("./components/admin/AdminProfile"));
const PopularRouteManagement = lazy(
  () => import("./components/admin/PopularRouteManagement"),
);
const PromotionManagement = lazy(
  () => import("./components/admin/PromotionManagement"),
);

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/support" element={<Support />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ticket-booking" element={<TicketBooking />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="buses" element={<BusManagement />} />
          <Route path="routes" element={<RouteManagement />} />
          <Route path="schedules" element={<ScheduleManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="popular-routes" element={<PopularRouteManagement />} />
          <Route path="promotions" element={<PromotionManagement />} />
        </Route>

        {/* Allow Tempo to capture routes before the catchall */}
        {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}
      </Routes>
    </Suspense>
  );
}

export default App;
