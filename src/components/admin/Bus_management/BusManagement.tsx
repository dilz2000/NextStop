
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Pencil, 
  Trash2, 
  Search, 
  Bus as BusIcon, 
  Users, 
  Activity,
  Loader2,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import AddBusModal from "./AddBusModal";
import EditBusModal from "./EditBusModal";
import { fetchAllBuses, Bus } from "../../../api/busApi";

interface NewBus {
  busNumber: string;
  type: 'AC' | 'Non-AC';   
  totalSeats: number;
  operatorName: string;
  status: 'active' | 'inactive';
  amenities: string[];
}

const BusManagement = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [filteredBuses, setFilteredBuses] = useState<Bus[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentBus, setCurrentBus] = useState<Bus | null>(null);
  const [newBus, setNewBus] = useState<NewBus>({
    busNumber: "",
    type: "AC",
    totalSeats: 0,
    operatorName: "",
    status: 'active',
    amenities: [],
  });
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');


  // Load buses from API
  const loadBuses = async () => {
    try {
      setLoading(true);
      setError(null);
      const busData = await fetchAllBuses();
      setBuses(busData);
      setFilteredBuses(busData);
    } catch (err) {
      setError("Failed to load buses. Please try again later.");
      console.error("Error loading buses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuses();
  }, []);

  useEffect(() => {
    let filtered = buses.filter(
      (bus) =>
        bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(bus => bus.status === statusFilter);
    }
  
    setFilteredBuses(filtered);
  }, [buses, searchTerm, statusFilter]);

  const handleAddBus = async () => {
    // Reload buses from API to reflect changes
    await loadBuses();
    setIsAddDialogOpen(false);
  };
  
  const handleEditBus = async () => {
    // Reload buses from API to reflect changes
    await loadBuses();
    setIsEditDialogOpen(false);
  };
  

  const handleDeleteBus = (id: string) => {
    // This will be implemented when you ask for delete functionality
    console.log("Delete bus functionality to be implemented for ID:", id);
  };

  const openEditDialog = (bus: Bus) => {
    setCurrentBus({ ...bus });
    setIsEditDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? "bg-green-100 text-green-800 border-green-200" 
      : "bg-red-100 text-red-800 border-red-200";
  };

  const getTypeIcon = (type: string) => {
    return type === 'AC' ? '❄️' : '🌡️';
  };

  const getFilteredStats = () => {
    const currentBuses = statusFilter === 'all' ? buses : buses.filter(bus => bus.status === statusFilter);
    return {
      total: currentBuses.length,
      active: currentBuses.filter(bus => bus.status === 'active').length,
      totalSeats: currentBuses.reduce((sum, bus) => sum + bus.totalSeats, 0),
      uniqueOperators: new Set(currentBuses.map(bus => bus.operatorName)).size
    };
  };

  const stats = getFilteredStats();


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading buses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Buses</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadBuses} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BusIcon className="h-8 w-8 text-blue-600" />
            Bus Management
          </h1>
          <p className="text-gray-600 mt-1">Manage your fleet of buses</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={loadBuses}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <AddBusModal
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            newBus={newBus}
            setNewBus={setNewBus}
            onAddBus={handleAddBus}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border shadow-sm"
        >
          <div className="flex items-center">
            <BusIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Buses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg border shadow-sm"
        >
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Buses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg border shadow-sm"
        >
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Seats</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSeats}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg border shadow-sm"
        >
          <div className="flex items-center">
            <BusIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Operators</p>
              <p className="text-2xl font-bold text-gray-900">{stats.uniqueOperators}</p>
            </div>
          </div>
        </motion.div>
      </div>
     
      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search buses by number, operator, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <Activity className="h-4 w-4 text-gray-500" />
            <Select
              value={statusFilter}
              onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>All Buses</span>
                  </div>
                </SelectItem>
                <SelectItem value="active">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Active Only</span>
                  </div>
                </SelectItem>
                <SelectItem value="inactive">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Inactive Only</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Filter Results Info */}
        {(searchTerm || statusFilter !== 'all') && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span>
              Found {filteredBuses.length} bus(es)
            </span>
            {searchTerm && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                matching "{searchTerm}"
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className={`px-2 py-1 rounded-full text-xs ${
                statusFilter === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {statusFilter} status
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>


      {/* Bus Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg border shadow-sm"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Bus Number</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Operator</TableHead>
              <TableHead className="font-semibold">Total Seats</TableHead>
              <TableHead className="font-semibold">Amenities</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBuses.length > 0 ? (
              filteredBuses.map((bus, index) => (
                <motion.tr
                  key={bus.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <BusIcon className="h-4 w-4 text-blue-600" />
                      {bus.busNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTypeIcon(bus.type)}</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {bus.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{bus.operatorName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      {bus.totalSeats}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {bus.amenities && bus.amenities.length > 0 ? (
                        bus.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10"
                          >
                            {amenity}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">No amenities</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(bus.status)}
                    >
                      {bus.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(bus)}
                        className="hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                              Delete Bus
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete bus <strong>{bus.busNumber}</strong>? 
                              This action cannot be undone and will permanently remove the bus 
                              from the system.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteBus(bus.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete Bus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center">
                    <BusIcon className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No buses found</h3>
                    <p className="text-gray-500">
                      {searchTerm 
                        ? `No buses match your search "${searchTerm}"`
                        : "Get started by adding your first bus"
                      }
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* Edit Dialog */}
      <EditBusModal
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentBus={currentBus}
        setCurrentBus={setCurrentBus}
        onEditBus={handleEditBus}
      />
    </div>
  );
};

export default BusManagement;
