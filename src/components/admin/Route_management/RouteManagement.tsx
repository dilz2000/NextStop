
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Pencil, Trash2, Search } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import AddRouteModal from "./AddRouteModal";
// import EditRouteModal from "./EditRouteModal";

// interface Route {
//   id: string;
//   origin: string;
//   destination: string;
//   distance: number;
//   duration: number;
//   fare: number;
//   isActive: boolean;
// }

// interface NewRoute {
//   origin: string;
//   destination: string;
//   distance: number;
//   duration: number;
//   fare: number;
//   isActive: boolean;
// }

// const RouteManagement = () => {
//   // Sample data for routes
//   const [routes, setRoutes] = useState<Route[]>([
//     {
//       id: "R001",
//       origin: "New York, NY",
//       destination: "Boston, MA",
//       distance: 215,
//       duration: 240,
//       fare: 45.0,
//       isActive: true,
//     },
//     {
//       id: "R002",
//       origin: "Los Angeles, CA",
//       destination: "San Francisco, CA",
//       distance: 380,
//       duration: 360,
//       fare: 65.0,
//       isActive: true,
//     },
//     {
//       id: "R003",
//       origin: "Chicago, IL",
//       destination: "Detroit, MI",
//       distance: 280,
//       duration: 300,
//       fare: 55.0,
//       isActive: false,
//     },
//   ]);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
//   const [newRoute, setNewRoute] = useState<NewRoute>({
//     origin: "",
//     destination: "",
//     distance: 0,
//     duration: 0,
//     fare: 0,
//     isActive: true,
//   });

//   // Filter routes based on search term
//   const filteredRoutes = routes.filter(
//     (route) =>
//       route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       route.destination.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   const handleAddRoute = () => {
//     const id = `R${String(routes.length + 1).padStart(3, "0")}`;
//     setRoutes([...routes, { ...newRoute, id }]);
//     setNewRoute({
//       origin: "",
//       destination: "",
//       distance: 0,
//       duration: 0,
//       fare: 0,
//       isActive: true,
//     });
//     setIsAddDialogOpen(false);
//   };

//   const handleEditRoute = () => {
//     if (!currentRoute) return;
//     setRoutes(
//       routes.map((route) =>
//         route.id === currentRoute.id ? currentRoute : route,
//       ),
//     );
//     setIsEditDialogOpen(false);
//   };

//   const handleDeleteRoute = (id: string) => {
//     setRoutes(routes.filter((route) => route.id !== id));
//   };

//   const openEditDialog = (route: Route) => {
//     setCurrentRoute({ ...route });
//     setIsEditDialogOpen(true);
//   };

//   // Format duration in minutes to hours and minutes
//   const formatDuration = (minutes: number) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return `${hours}h ${mins}m`;
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Route Management</h1>
//         <AddRouteModal
//           isOpen={isAddDialogOpen}
//           onOpenChange={setIsAddDialogOpen}
//           newRoute={newRoute}
//           setNewRoute={setNewRoute}
//           onAddRoute={handleAddRoute}
//         />
//       </div>

//       {/* Search */}
//       <div className="mb-6">
//         <div className="relative">
//           <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
//           <Input
//             placeholder="Search routes by origin or destination"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-8"
//           />
//         </div>
//       </div>

//       {/* Route Table */}
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>ID</TableHead>
//               <TableHead>Origin</TableHead>
//               <TableHead>Destination</TableHead>
//               <TableHead>Distance</TableHead>
//               <TableHead>Duration</TableHead>
//               <TableHead>Fare</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredRoutes.length > 0 ? (
//               filteredRoutes.map((route) => (
//                 <TableRow key={route.id}>
//                   <TableCell>{route.id}</TableCell>
//                   <TableCell className="font-medium">{route.origin}</TableCell>
//                   <TableCell>{route.destination}</TableCell>
//                   <TableCell>{route.distance} miles</TableCell>
//                   <TableCell>{formatDuration(route.duration)}</TableCell>
//                   <TableCell>${route.fare.toFixed(2)}</TableCell>
//                   <TableCell>
//                     <span
//                       className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${route.isActive ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20" : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"}`}
//                     >
//                       {route.isActive ? "Active" : "Inactive"}
//                     </span>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <div className="flex justify-end space-x-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => openEditDialog(route)}
//                       >
//                         <Pencil className="h-4 w-4" />
//                       </Button>
//                       <AlertDialog>
//                         <AlertDialogTrigger asChild>
//                           <Button variant="outline" size="sm">
//                             <Trash2 className="h-4 w-4 text-red-500" />
//                           </Button>
//                         </AlertDialogTrigger>
//                         <AlertDialogContent>
//                           <AlertDialogHeader>
//                             <AlertDialogTitle>
//                               Are you sure you want to delete this route?
//                             </AlertDialogTitle>
//                             <AlertDialogDescription>
//                               This action cannot be undone. This will
//                               permanently delete the route and remove it from
//                               our servers.
//                             </AlertDialogDescription>
//                           </AlertDialogHeader>
//                           <AlertDialogFooter>
//                             <AlertDialogCancel>Cancel</AlertDialogCancel>
//                             <AlertDialogAction
//                               onClick={() => handleDeleteRoute(route.id)}
//                               className="bg-red-500 hover:bg-red-600"
//                             >
//                               Delete
//                             </AlertDialogAction>
//                           </AlertDialogFooter>
//                         </AlertDialogContent>
//                       </AlertDialog>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={8} className="text-center py-4">
//                   No routes found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Edit Dialog */}
//       <EditRouteModal
//         isOpen={isEditDialogOpen}
//         onOpenChange={setIsEditDialogOpen}
//         currentRoute={currentRoute}
//         setCurrentRoute={setCurrentRoute}
//         onEditRoute={handleEditRoute}
//       />
//     </div>
//   );
// };

// export default RouteManagement;



/////////////////////


import React, { useState, useEffect } from "react";
import { Search, MapPin, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import AddRouteModal from "./AddRouteModal";
import EditRouteModal from "./EditRouteModal";
import { fetchAllRoutes, Route } from "../../../api/routeApi";

const RouteManagement: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);

  const loadRoutes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllRoutes();
      setRoutes(data);
      setFilteredRoutes(data);
    } catch (err) {
      setError("Failed to load routes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRoutes(); }, []);

  useEffect(() => {
    const filtered = routes.filter(
      (r) =>
        r.sourceCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.destinationCity.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRoutes(filtered);
  }, [routes, searchTerm]);

  const handleAddRoute = async () => {
    await loadRoutes();
    setIsAddDialogOpen(false);
  };

  const handleEditRoute = async () => {
    await loadRoutes();
    setIsEditDialogOpen(false);
  };

  const handleDeleteRoute = (id: number) => {
    setRoutes(routes.filter((r) => r.id !== id));
  };

  const openEditDialog = (route: Route) => {
    setCurrentRoute({ ...route });
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Routes</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadRoutes} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="h-7 w-7 text-blue-600" />
          Route Management
        </h1>
        <AddRouteModal
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddRoute={handleAddRoute}
        />
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search routes by source or destination"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Distance (km)</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoutes.length > 0 ? (
              filteredRoutes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>{route.id}</TableCell>
                  <TableCell>{route.sourceCity}</TableCell>
                  <TableCell>{route.destinationCity}</TableCell>
                  <TableCell>{route.distanceKm}</TableCell>
                  <TableCell>{route.duration}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${route.status === "active"
                        ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                        : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                      }`}>
                      {route.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(route)}
                      >
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to delete this route?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the route.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteRoute(route.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No routes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <EditRouteModal
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
        onEditRoute={handleEditRoute}
      />
    </div>
  );
};

export default RouteManagement;
