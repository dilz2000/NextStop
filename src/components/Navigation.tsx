
// import React, { useState, useEffect } from "react";
// import { Button } from "./ui/button";
// import { LogOut, User } from "lucide-react";
// import UserProfile from "./UserProfile";

// interface NavigationProps {
//   currentPage?: string;
// }

// interface UserData {
//   id: number;
//   token: string;
//   role: string;
//   fullName: string;
//   email: string;
//   refreshToken: string;
// }

// const Navigation: React.FC<NavigationProps> = ({ currentPage = "" }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
//   const [showUserProfile, setShowUserProfile] = useState(false);

//   useEffect(() => {
//     // Check if user is logged in on component mount
//     checkAuthStatus();
//   }, []);

//   const checkAuthStatus = () => {
//     const token = localStorage.getItem('authToken');
//     const user = localStorage.getItem('user');
    
//     if (token && user) {
//       try {
//         const parsedUser = JSON.parse(user);
//         setUserData(parsedUser);
//         setIsLoggedIn(true);
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//         // Clear invalid data
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('user');
//       }
//     }
//   };

//   const handleLogout = () => {
//     setShowLogoutConfirm(true);
//   };

//   const confirmLogout = () => {
//     // Clear all authentication data
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('user');
//     localStorage.removeItem('refreshToken');
    
//     // Reset state
//     setIsLoggedIn(false);
//     setUserData(null);
//     setShowLogoutConfirm(false);
//     setShowUserProfile(false);
    
//     // Redirect to home page
//     window.location.href = '/';
//   };

//   const cancelLogout = () => {
//     setShowLogoutConfirm(false);
//   };

//   const getInitials = (fullName: string): string => {
//     if (!fullName) return 'U';
//     const names = fullName.trim().split(' ');
//     if (names.length === 1) {
//       return names[0].charAt(0).toUpperCase();
//     }
//     return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
//   };

//   return (
//     <>
//       <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
//         <div className="container mx-auto flex justify-between items-center">
//           <div className="flex items-center">
//             <a href="/">
//               <h1 className="text-2xl font-bold text-primary">NextStop</h1>
//             </a>
//           </div>
//           <div className="hidden md:flex space-x-6">
//             <a
//               href="/"
//               className={`transition-colors ${
//                 currentPage === "home"
//                   ? "text-primary font-medium"
//                   : "text-gray-600 hover:text-primary"
//               }`}
//             >
//               Home
//             </a>
//             <a
//               href="/ticket-booking"
//               className={`transition-colors ${
//                 currentPage === "booking"
//                   ? "text-primary font-medium"
//                   : "text-gray-600 hover:text-primary"
//               }`}
//             >
//               Book Tickets
//             </a>
//             <a
//               href="/my-bookings"
//               className={`transition-colors ${
//                 currentPage === "my-bookings"
//                   ? "text-primary font-medium"
//                   : "text-gray-600 hover:text-primary"
//               }`}
//             >
//               My Bookings
//             </a>
//             <a
//               href="/support"
//               className={`transition-colors ${
//                 currentPage === "support"
//                   ? "text-primary font-medium"
//                   : "text-gray-600 hover:text-primary"
//               }`}
//             >
//               Support
//             </a>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             {isLoggedIn && userData ? (
//               <>
//                 {/* User Profile Icon */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowUserProfile(!showUserProfile)}
//                     className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-medium text-sm"
//                     title={`${userData.fullName} - Click to view profile`}
//                   >
//                     {getInitials(userData.fullName)}
//                   </button>
                  
//                   {/* User Profile Dropdown */}
//                   {showUserProfile && (
//                     <UserProfile
//                       userData={userData}
//                       onClose={() => setShowUserProfile(false)}
//                     />
//                   )}
//                 </div>
                
//                 {/* Logout Button */}
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={handleLogout}
//                   className="flex items-center space-x-2 text-600 border-200 hover:bg-50 hover:border-300"
//                 >
//                   <LogOut className="w-4 h-4" />
//                   <span>Logout</span>
//                 </Button>
//               </>
//             ) : (
//               <>
//                 {/* Sign In and Register buttons for non-authenticated users */}
//                 <Button variant="outline" size="sm" onClick={() => window.location.href = '/login'}>
//                   Sign In
//                 </Button>
//                 <Button size="sm" onClick={() => window.location.href = '/register'}>
//                   Register
//                 </Button>
//               </>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* Logout Confirmation Modal */}
//       {showLogoutConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
//             <div className="flex items-center mb-4">
//               <LogOut className="w-6 h-6 text-red-500 mr-3" />
//               <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
//             </div>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to logout? You'll need to sign in again to access your account.
//             </p>
//             <div className="flex space-x-3">
//               <Button
//                 variant="outline"
//                 onClick={cancelLogout}
//                 className="flex-1"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={confirmLogout}
//                 className="flex-1 bg-red-600 hover:bg-red-700 text-white"
//               >
//                 Logout
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Navigation;


/////////////////


import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { LogOut, User, Settings, Shield } from "lucide-react";
import UserProfile from "./UserProfile";

interface NavigationProps {
  currentPage?: string;
}

interface UserData {
  id: number;
  token: string;
  role: string;
  fullName: string;
  email: string;
  refreshToken: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage = "" }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  useEffect(() => {
    // Check if user is logged in on component mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    
    // Reset state
    setIsLoggedIn(false);
    setUserData(null);
    setShowLogoutConfirm(false);
    setShowUserProfile(false);
    
    // Redirect to home page
    window.location.href = '/';
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleAdminDashboard = () => {
    window.location.href = '/admin';
  };

  const getInitials = (fullName: string): string => {
    if (!fullName) return 'U';
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const isAdmin = userData?.role === 'ROLE_ADMIN';

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-2 py-3 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between w-full">
          {/* Left Section - Logo */}
          <div className="flex items-center flex-shrink-0">
            <a href="/">
              <h1 className="text-2xl font-bold text-primary ml-6">NextStop</h1>
            </a>
          </div>

          {/* Center Section - Navigation Links */}
          <div className="hidden md:flex space-x-6 absolute left-1/2 transform -translate-x-1/2">
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
          
          {/* Right Section - User Actions */}
          <div className="flex items-center space-x-3 flex-shrink-0 pr-4">
            {isLoggedIn && userData ? (
              <>
                {/* Admin Dashboard Button - Only for admins */}
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAdminDashboard}
                    className="flex items-center space-x-2 bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
                  >
                    <Shield className="w-4 h-4 text-gray-600" />
                    <span className="hidden sm:inline">Admin Dashboard</span>
                    <span className="sm:hidden">Admin</span>
                  </Button>
                )}
                
                {/* User Profile Icon */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserProfile(!showUserProfile)}
                    className="flex items-center justify-center w-10 h-10 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105"
                    title={`${userData.fullName} - Click to view profile`}
                  >
                    {getInitials(userData.fullName)}
                  </button>
                  
                  {/* User Profile Dropdown */}
                  {showUserProfile && (
                    <UserProfile
                      userData={userData}
                      onClose={() => setShowUserProfile(false)}
                      onProfileUpdate={(updatedData) => {
                        // Update the userData state with new information
                        setUserData(prev => prev ? { ...prev, ...updatedData } : null);
                      }}
                    />
                  )}

                </div>
                
                {/* Logout Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 text-gray-600" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                {/* Sign In and Register buttons for non-authenticated users */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.href = '/login'}
                  className="hover:bg-gray-50 hover:border-gray-400 transition-colors text-gray-700 border-gray-300"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => window.location.href = '/register'}
                  className="bg-primary hover:bg-primary/90 transition-colors"
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-2xl border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-600">Confirm Logout</h3>
                <p className="text-sm text-red-500">Are you sure?</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              You'll need to sign in again to access your account and bookings.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={cancelLogout}
                className="flex-1 hover:bg-gray-50 transition-colors border-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmLogout}
                className="flex-1 bg-gray-700 hover:bg-red-800 text-white transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2 text-white" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
