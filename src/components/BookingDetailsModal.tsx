
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign, 
  Bus,
  User,
  Armchair,
  Download
} from "lucide-react";
import { Booking } from "../api/myBookingsApi";
import jsPDF from 'jspdf';

interface BookingDetailsModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  if (!booking) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  const downloadTicket = () => {
    const doc = new jsPDF();
    
    // Get user info from localStorage
    const getUserInfo = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          return {
            fullName: user.fullName || 'N/A',
            email: user.email || 'N/A'
          };
        }
        return { fullName: 'N/A', email: 'N/A' };
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        return { fullName: 'N/A', email: 'N/A' };
      }
    };
  
    const userInfo = getUserInfo();
    
    // Page setup
    const pageWidth = 210;
    const pageHeight = 297; // A4 height
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    const maxY = pageHeight - 20; // Leave 20mm at bottom
    
    // Colors
    const headerBg: [number, number, number] = [0, 0, 0];
    const sectionBg: [number, number, number] = [245, 245, 245];
    const borderColor: [number, number, number] = [200, 200, 200];
    
    let yPos = 20;
    
    // Check if we're approaching page limit
    const checkPageLimit = (additionalSpace: number = 0) => {
      if (yPos + additionalSpace > maxY) {
        // Add new page if needed
        doc.addPage();
        yPos = 20;
      }
    };
    
    // Header
    doc.setFillColor(...headerBg);
    doc.rect(0, 0, pageWidth, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('BUS TICKET', margin, 15);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('NextStop - Your Travel Partner', margin, 22);
    
    // Booking ID on the right
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const bookingText = `Booking #${booking.bookingId}`;
    const bookingWidth = doc.getTextWidth(bookingText);
    doc.text(bookingText, pageWidth - margin - bookingWidth, 20);
    
    yPos = 50;
    
    // Helper functions
    const addSectionHeader = (title: string) => {
      checkPageLimit(20);
      doc.setFillColor(...sectionBg);
      doc.rect(margin, yPos - 3, contentWidth, 12, 'F');
      
      doc.setDrawColor(...borderColor);
      doc.setLineWidth(0.5);
      doc.rect(margin, yPos - 3, contentWidth, 12);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin + 3, yPos + 5);
      
      yPos += 18;
    };
    
    const addFieldRow = (label: string, value: string, isTotal = false) => {
      checkPageLimit(15);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(isTotal ? 12 : 10);
      doc.setFont('helvetica', isTotal ? 'bold' : 'normal');
      
      doc.text(label, margin + 3, yPos);
      
      const valueWidth = doc.getTextWidth(value);
      doc.text(value, pageWidth - margin - 3 - valueWidth, yPos);
      
      if (isTotal) {
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(margin, yPos - 8, pageWidth - margin, yPos - 8);
      }
      
      yPos += isTotal ? 12 : 10;
    };
    
    // 1. Passenger Information
    addSectionHeader('PASSENGER INFORMATION');
    addFieldRow('Passenger Name:', userInfo.fullName);
    addFieldRow('Email Address:', userInfo.email);
    yPos += 5;
    
    // 2. Booking Information
    addSectionHeader('BOOKING INFORMATION');
    addFieldRow('Booking ID:', `#${booking.bookingId}`);
    addFieldRow('Booked On:', formatDateTime(booking.bookingDateTime));
    yPos += 5;
    
    // 3. Journey Details
    addSectionHeader('JOURNEY DETAILS');
    
    // Route display
    checkPageLimit(20);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const routeText = `${booking.source} to ${booking.destination}`;
    const routeWidth = doc.getTextWidth(routeText);
    doc.text(routeText, (pageWidth - routeWidth) / 2, yPos);
    yPos += 15;
    
    addFieldRow('Travel Date:', formatDate(booking.travelDate));
    addFieldRow('Departure Time:', booking.departureTime);
    yPos += 5;
    
    // 4. Bus Information
    addSectionHeader('BUS INFORMATION');
    addFieldRow('Operator:', booking.operatorName);
    addFieldRow('Bus Number:', booking.busNumber);
    addFieldRow('Bus Type:', booking.busType);
    yPos += 5;
    
    // 5. Seat & Payment Details
    addSectionHeader('SEAT & PAYMENT DETAILS');
    addFieldRow('Number of Seats:', booking.numberOfSeats.toString());
    addFieldRow('Seat Numbers:', booking.seatNumbers.join(', '));
    addFieldRow('Price per Seat:', `$${booking.pricePerSeat.toFixed(2)}`);
    yPos += 3;
    
    // Total amount highlighted
    checkPageLimit(20);
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos - 5, contentWidth, 15, 'F');
    addFieldRow('TOTAL AMOUNT:', `LKR ${booking.totalPrice.toFixed(2)}`, true);
    yPos += 8;
    
    // Important Notes
    addSectionHeader('IMPORTANT NOTES');
    
    checkPageLimit(40);
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    const notes = [
      '• Arrive 15 minutes before departure time',
      '• Carry valid ID proof for verification',
      '• Ticket is non-transferable and non-refundable',
      '• Keep this ticket safe during your journey'
    ];
    
    notes.forEach(note => {
      checkPageLimit(10);
      doc.text(note, margin + 3, yPos);
      yPos += 8;
    });
    
    // Footer
    checkPageLimit(15);
    yPos += 10;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    
    yPos += 8;
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(8);
    doc.text('Generated on: ' + new Date().toLocaleString(), margin, yPos);
    doc.text('NextStop © 2025', pageWidth - margin - 25, yPos);
    
    // Save the PDF
    const fileName = `NextStop_Ticket_${userInfo.fullName.replace(/\s+/g, '')}_${booking.bookingId}.pdf`;
    doc.save(fileName);
  };
  

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Booking Details
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Booking ID and Status */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Booking Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Booking ID:</span>
                      <span className="ml-2 font-medium">#{booking.bookingId}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Booked On:</span>
                      <span className="ml-2 font-medium">
                        {formatDateTime(booking.bookingDateTime)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Journey Details */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Journey Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="font-medium">{booking.source}</span>
                      </div>
                      <div className="flex-1 border-t border-dashed border-gray-300 mx-4"></div>
                      <div className="flex items-center">
                        <span className="font-medium">{booking.destination}</span>
                        <div className="w-3 h-3 bg-red-500 rounded-full ml-3"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-green-600" />
                        <span>{formatDate(booking.travelDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-green-600" />
                        <span>{booking.departureTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bus Details */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
                    <Bus className="h-5 w-5 mr-2" />
                    Bus Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-purple-700">Operator:</span>
                      <span className="ml-2 font-medium">{booking.operatorName}</span>
                    </div>
                    <div>
                      <span className="text-purple-700">Bus Number:</span>
                      <span className="ml-2 font-medium">{booking.busNumber}</span>
                    </div>
                    <div>
                      <span className="text-purple-700">Bus Type:</span>
                      <span className="ml-2 font-medium">{booking.busType}</span>
                    </div>
                  </div>
                </div>

                {/* Seat and Payment Details */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-3 flex items-center">
                    <Armchair className="h-5 w-5 mr-2" />
                    Seat & Payment Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-orange-600" />
                        <span className="text-sm">Number of Seats:</span>
                      </div>
                      <span className="font-medium">{booking.numberOfSeats}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Seat Numbers:</span>
                      <div className="flex gap-2">
                        {booking.seatNumbers.map((seat, index) => (
                          <span
                            key={index}
                            className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs font-medium"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Price per seat:</span>
                        <span>LKR {booking.pricePerSeat.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-orange-900">
                        <span>Total Amount:</span>
                        <span>LKR {booking.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Cancel Booking
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={downloadTicket}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Ticket
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingDetailsModal;
