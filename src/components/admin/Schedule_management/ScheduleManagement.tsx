
import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Search, Loader2, RefreshCw, AlertCircle, Calendar, Clock, DollarSign, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import AddScheduleModal from './AddScheduleModal';
import EditScheduleModal from './EditScheduleModal';
import { fetchAllSchedules, fetchAllBuses, fetchAllRoutes, Schedule, Bus, Route } from '../../../api/ScheduleMAnageApi';

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [schedulesData, busesData, routesData] = await Promise.all([
        fetchAllSchedules(),
        fetchAllBuses(),
        fetchAllRoutes()
      ]);
      setSchedules(schedulesData);
      setFilteredSchedules(schedulesData);
      setBuses(busesData);
      setRoutes(routesData);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const filtered = schedules.filter(
      (s) =>
        s.bus.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${s.route.sourceCity} to ${s.route.destinationCity}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSchedules(filtered);
  }, [schedules, searchTerm]);

  const handleAddSchedule = async () => {
    await loadData();
    setIsAddDialogOpen(false);
  };

  const handleEditSchedule = async () => {
    await loadData();
    setIsEditDialogOpen(false);
  };

  const handleDeleteSchedule = (id: number) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  const openEditDialog = (schedule: Schedule) => {
    setCurrentSchedule({ ...schedule });
    setIsEditDialogOpen(true);
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading schedules...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Schedules</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadData} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            Schedule Management
          </h1>
          <p className="text-gray-600 mt-1">Manage bus schedules and timetables</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={loadData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <AddScheduleModal
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onAddSchedule={handleAddSchedule}
            buses={buses}
            routes={routes}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Schedules</p>
              <p className="text-2xl font-bold text-gray-900">{schedules.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Schedules</p>
              <p className="text-2xl font-bold text-gray-900">
                {schedules.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Fare</p>
              <p className="text-2xl font-bold text-gray-900">
                ${schedules.length > 0 ? (schedules.reduce((sum, s) => sum + s.fare, 0) / schedules.length).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Routes Covered</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(schedules.map(s => s.route.id)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search schedules by operator or route..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            Found {filteredSchedules.length} schedule(s) matching "{searchTerm}"
          </p>
        )}
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Bus Operator</TableHead>
              <TableHead className="font-semibold">Route</TableHead>
              {/* <TableHead className="font-semibold">Date</TableHead> */}
              <TableHead className="font-semibold">Departure Time</TableHead>
              <TableHead className="font-semibold">Fare</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedules.length > 0 ? (
              filteredSchedules.map((schedule) => (
                <TableRow key={schedule.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium">{schedule.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      {schedule.bus.operatorName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{schedule.route.sourceCity}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium">{schedule.route.destinationCity}</span>
                    </div>
                  </TableCell>
                  {/* <TableCell>{formatDate(schedule.departureTime)}</TableCell> */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      {formatTime(schedule.departureTime)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 ">
                      <Banknote className="h-4 w-4 text-green-700" />
                      <span className="font-medium">
                        LKR {schedule.fare.toLocaleString("en-LK", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    {/* <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{schedule.fare.toFixed(2)}</span>
                    </div> */}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={schedule.status === 'active' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                      }
                    >
                      {schedule.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(schedule)}
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
                              Delete Schedule
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this schedule? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete Schedule
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
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex flex-col items-center">
                    <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules found</h3>
                    <p className="text-gray-500">
                      {searchTerm 
                        ? `No schedules match your search "${searchTerm}"`
                        : "Get started by adding your first schedule"
                      }
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <EditScheduleModal
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentSchedule={currentSchedule}
        setCurrentSchedule={setCurrentSchedule}
        onEditSchedule={handleEditSchedule}
        buses={buses}
        routes={routes}
      />
    </div>
  );
};

export default ScheduleManagement;
