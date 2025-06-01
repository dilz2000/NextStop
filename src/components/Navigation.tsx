import React from "react";
import { Button } from "./ui/button";

interface NavigationProps {
  currentPage?: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage = "" }) => {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <a href="/">
            <h1 className="text-2xl font-bold text-primary">NextStop</h1>
          </a>
        </div>
        <div className="hidden md:flex space-x-6">
          <a
            href="/"
            className={`transition-colors ${
              currentPage === "home"
                ? "text-primary font-medium"
                : "text-gray-600 hover:text-primary"
            }`}
          >
            Home
          </a>
          <a
            href="/ticket-booking"
            className={`transition-colors ${
              currentPage === "booking"
                ? "text-primary font-medium"
                : "text-gray-600 hover:text-primary"
            }`}
          >
            Book Tickets
          </a>
          <a
            href="/my-bookings"
            className={`transition-colors ${
              currentPage === "my-bookings"
                ? "text-primary font-medium"
                : "text-gray-600 hover:text-primary"
            }`}
          >
            My Bookings
          </a>
          <a
            href="/support"
            className={`transition-colors ${
              currentPage === "support"
                ? "text-primary font-medium"
                : "text-gray-600 hover:text-primary"
            }`}
          >
            Support
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
          <Button size="sm">Register</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
