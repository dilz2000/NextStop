import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  Star,
  Shield,
  Clock,
} from "lucide-react";
import SearchPanel from "./SearchPanel";
import ContentBlock from "./ContentBlock";
import { Button } from "./ui/button";
import { TooltipProvider } from "./ui/tooltip";
import { format } from "date-fns";
import Navigation from "./Navigation";

import { fetchSchedules, ScheduleResponse } from "@/api/scheduleApi";
import SearchResults from "@/components/SearchResults";

const HomePage = () => {
  const [searchResults, setSearchResults] = useState<{
    origin: string;
    destination: string;
    date: Date | undefined;
  } | null>(null);
  
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);

  // Sample data for content blocks
  const [popularRoutes, setPopularRoutes] = useState([
    {
      id: "1",
      title: "New York to Boston",
      description: "Daily departures, 4.5 hour journey",
      image:
        "https://images.unsplash.com/photo-1582145641462-afd3c5efd5a3?w=800&q=80",
      action: "Select Route",
    },
    {
      id: "2",
      title: "Los Angeles to San Francisco",
      description: "Premium coaches, 6 hour scenic drive",
      image:
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
      action: "Select Route",
    },
    {
      id: "3",
      title: "Chicago to Detroit",
      description: "Overnight options available, 5 hour journey",
      image:
        "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=800&q=80",
      action: "Select Route",
    },
    {
      id: "4",
      title: "Seattle to Portland",
      description: "Scenic route with mountain views, 3 hour journey",
      image:
        "https://images.unsplash.com/photo-1533461502717-83e21c326498?w=800&q=80",
      action: "Select Route",
    },
    {
      id: "5",
      title: "Miami to Orlando",
      description: "Luxury coaches with WiFi, 4 hour journey",
      image:
        "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&q=80",
      action: "Select Route",
    },
  ]);

  const [promotions, setPromotions] = useState([
    {
      id: "1",
      title: "Weekend Getaway",
      description: "25% off on all weekend trips booked 7 days in advance",
      image:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
      action: "View Offer",
    },
    {
      id: "2",
      title: "Student Discount",
      description: "Special 15% discount for students with valid ID",
      image:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
      action: "View Offer",
    },
    {
      id: "3",
      title: "Group Travel",
      description: "Book for 4+ people and get 10% off each ticket",
      image:
        "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80",
      action: "View Offer",
    },
    {
      id: "4",
      title: "Early Bird Special",
      description: "Book 30 days in advance and save 20% on your ticket",
      image:
        "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=800&q=80",
      action: "View Offer",
    },
    {
      id: "5",
      title: "Senior Citizen Discount",
      description: "10% off for travelers aged 65 and above",
      image:
        "https://images.unsplash.com/photo-1476458393436-fb317d87c161?w=800&q=80",
      action: "View Offer",
    },
  ]);

  const [trustIndicators, setTrustIndicators] = useState([
    {
      id: "1",
      title: "Verified Operators",
      description:
        "All our bus partners undergo strict safety and quality checks",
      icon: <Shield className="h-10 w-10 text-primary" />,
      action: "",
    },
    {
      id: "2",
      title: "Customer Satisfaction",
      description: "4.8/5 average rating from over 10,000 happy customers",
      icon: <Star className="h-10 w-10 text-primary" />,
      action: "",
    },
    {
      id: "3",
      title: "24/7 Support",
      description: "Our customer service team is available round the clock",
      icon: <Clock className="h-10 w-10 text-primary" />,
      action: "",
    },
    {
      id: "4",
      title: "Secure Payments",
      description: "All transactions are encrypted and secure",
      icon: <Shield className="h-10 w-10 text-primary" />,
      action: "",
    },
    {
      id: "5",
      title: "Easy Cancellation",
      description: "Hassle-free cancellation up to 24 hours before departure",
      icon: <Clock className="h-10 w-10 text-primary" />,
      action: "",
    },
  ]);

  useEffect(() => {
  
    const fetchData = async () => {
      
      console.log("Data loaded successfully");
    };

    fetchData();
  }, []);

  const handleSearch = async (searchData: {
    origin: string;
    destination: string;
    date: Date | undefined;
  }) => {
    setSearchResults(searchData);
    if (searchData.origin && searchData.destination && searchData.date) {
      try {
        const formattedDate = searchData.date.toISOString().split("T")[0]; // yyyy-MM-dd
        const result = await fetchSchedules(
          searchData.origin,
          searchData.destination,
          formattedDate
        );
        setSchedules(result);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
        setSchedules([]);
      }
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        {/* Navigation Bar */}
        <Navigation currentPage="home" />

        {/* Hero Banner */}
        <div className="relative h-[500px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80"
            alt="Scenic bus route"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="container mx-auto px-4 relative z-20 h-full flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl text-white"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Travel Made Simple, Journey Made Memorable
              </h2>
              <p className="text-xl mb-6">
                Book bus tickets for thousands of routes across the country with
                just a few clicks. Enjoy comfortable travel, competitive prices,
                and exceptional service.
              </p>
              <div className="flex space-x-4">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  Explore Routes
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Search Panel */}
        <div className="container mx-auto px-4 -mt-16 relative z-30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SearchPanel onSearch={handleSearch} />
          </motion.div>
        </div>

        {/* Search Results */}
        {searchResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto max-w-4xl px-4 mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-100"
          >
            <h3 className="text-xl font-bold mb-4">Search Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
              <div>
                <p className="font-semibold">From:</p>
                <p className="text-lg">{searchResults.origin}</p>
              </div>
              <div>
                <p className="font-semibold">To:</p>
                <p className="text-lg">{searchResults.destination}</p>
              </div>
              <div>
                <p className="font-semibold">Date:</p>
                <p className="text-lg">
                  {searchResults.date
                    ? format(searchResults.date, "PPP")
                    : "Not selected"}
                </p>
              </div>
            </div>
            <SearchResults schedules={schedules} /> 
          </motion.div>
        )}


        {/* Content Blocks */}
        <div className="container mx-auto px-4 py-16">
          {/* Popular Routes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-16"
          >
            <ContentBlock
              title="Popular Routes"
              description="Discover our most traveled destinations and find your next adventure with comfortable buses and convenient schedules"
              contentType="routes"
              items={popularRoutes}
            />
          </motion.div>

          {/* Current Promotions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-16"
          >
            <ContentBlock
              title="Special Offers"
              description="Take advantage of our limited-time deals and discounts to save on your next journey"
              contentType="promotions"
              items={promotions}
            />
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <ContentBlock
              title="Why Choose Us"
              description="Thousands of travelers trust us for their journey every day. Experience reliable service, comfortable buses, and competitive prices"
              contentType="trust"
              items={trustIndicators}
            />
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">NextStop</h3>
                <p className="text-gray-600">
                  Making bus travel simple, convenient, and enjoyable since
                  2025. Our mission is to connect people and places with
                  reliable, comfortable, and affordable bus transportation.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-primary">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-primary">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-primary">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-primary">
                      Blog
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-primary">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-primary">
                      Cancellation Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-primary">
                      Refunds
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-primary">
                      FAQs
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Connect With Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-600 hover:text-primary">
                    <span className="sr-only">Facebook</span>
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-primary">
                    <span className="sr-only">Instagram</span>
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-primary">
                    <span className="sr-only">Twitter</span>
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
                <div className="mt-4">
                  <p className="text-gray-600">Subscribe to our newsletter</p>
                  <div className="mt-2 flex">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="px-3 py-2 border border-gray-300 rounded-l-md w-full"
                    />
                    <Button className="rounded-l-none">Subscribe</Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
              <p>&copy; 2025 NextStop. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
};

export default HomePage;
