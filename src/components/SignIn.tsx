import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { TooltipProvider } from "./ui/tooltip";

const SignIn = () => {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar - Reused from home page */}
        <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <a href="/">
                <h1 className="text-2xl font-bold text-primary">BusBooker</h1>
              </a>
            </div>
            <div className="hidden md:flex space-x-6">
              <a
                href="/"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Home
              </a>
              <a
                href="/my-bookings"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                My Bookings
              </a>
              <a
                href="/support"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Support
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-primary text-white hover:bg-primary/90"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => (window.location.href = "/register")}
              >
                Register
              </Button>
            </div>
          </div>
        </nav>

        {/* Sign In Form */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">Welcome Back</h2>
                <p className="text-gray-600 mt-2">
                  Sign in to access your account and manage your bookings
                </p>
              </div>

              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>

                <Button type="submit" className="w-full py-6">
                  Sign In
                </Button>

                <div className="text-center text-sm">
                  <span className="text-gray-600">Don't have an account? </span>
                  <a
                    href="/register"
                    className="text-primary hover:underline font-medium"
                  >
                    Create one now
                  </a>
                </div>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  <svg
                    className="mr-2 h-4 w-4"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                  >
                    <path
                      fill="currentColor"
                      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    ></path>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  <svg
                    className="mr-2 h-4 w-4"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="facebook"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"
                    ></path>
                  </svg>
                  Facebook
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SignIn;
