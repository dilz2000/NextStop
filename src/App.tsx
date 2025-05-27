import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

// Lazy load components for better performance
const MyBookings = lazy(() => import("./components/MyBookings"));
const Support = lazy(() => import("./components/Support"));
const SignIn = lazy(() => import("./components/SignIn"));
const Register = lazy(() => import("./components/Register"));
const TicketBooking = lazy(() => import("./components/TicketBooking"));

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/support" element={<Support />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ticket-booking" element={<TicketBooking />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
