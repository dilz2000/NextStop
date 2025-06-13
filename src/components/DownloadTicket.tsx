import React from "react";
import { Download } from "lucide-react";
import { Button } from "./ui/button";
import { Booking } from "../api/myBookingsApi";
import jsPDF from 'jspdf';

interface DownloadTicketProps {
  booking: Booking;
  className?: string;
}

const DownloadTicket: React.FC<DownloadTicketProps> = ({ booking, className = "" }) => {
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
    const pageHeight = 297;
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    const maxY = pageHeight - 20;
    
    // Colors
    const headerBg: [number, number, number] = [0, 0, 0];
    const sectionBg: [number, number, number] = [245, 245, 245];
    const borderColor: [number, number, number] = [200, 200, 200];
    
    let yPos = 20;
    
    // Check if we're approaching page limit
    const checkPageLimit = (additionalSpace: number = 0) => {
      if (yPos + additionalSpace > maxY) {
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
    addFieldRow('Price per Seat:', `LKR ${booking.pricePerSeat.toFixed(2)}`);
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
    <Button 
      className={className}
      onClick={downloadTicket}
    >
      <Download className="h-4 w-4 mr-2" />
      Download Ticket
    </Button>
  );
};

export default DownloadTicket;
