import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { HelpCircle, MessageCircle, Phone, Mail, FileText } from "lucide-react";
import Navigation from "./Navigation"

const Support = () => {
  // FAQ data
  const faqs = [
    {
      question: "How do I cancel my booking?",
      answer:
        "You can cancel your booking by going to 'My Bookings', selecting the booking you wish to cancel, and clicking the 'Cancel' button. Please note our cancellation policy for refund information.",
    },
    {
      question: "What is your refund policy?",
      answer:
        "Refunds are processed based on how far in advance you cancel. Cancellations made 48+ hours before departure receive a full refund. Cancellations 24-48 hours before departure receive a 50% refund. Cancellations less than 24 hours before departure are non-refundable.",
    },
    {
      question: "How early should I arrive before departure?",
      answer:
        "We recommend arriving at least 15-30 minutes before your scheduled departure time to ensure a smooth boarding process.",
    },
    {
      question: "Can I change the date of my booking?",
      answer:
        "Yes, you can modify your booking date by going to 'My Bookings' and selecting the 'Modify' option. Changes made less than 24 hours before departure may incur a fee.",
    },
    {
      question: "What luggage am I allowed to bring?",
      answer:
        "Each passenger is allowed one piece of luggage to be stored in the luggage compartment (up to 20kg) and one small carry-on item that can fit under your seat or in the overhead bin.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar - Reused from home page */}
      <Navigation currentPage="support" />


      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6">Customer Support</h2>

          {/* Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
              <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">
                Speak directly with our customer support team
              </p>
              <p className="text-lg font-medium text-primary mb-2">
                1-800-BUS-BOOK
              </p>
              <p className="text-sm text-gray-500">
                Available 24/7 for urgent matters
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
              <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">
                Chat with a support agent in real-time
              </p>
              <Button className="w-full">Start Chat</Button>
              <p className="text-sm text-gray-500 mt-2">
                Available 8AM - 10PM EST
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
              <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">
                Send us an email and we'll respond within 24 hours
              </p>
              <p className="text-lg font-medium text-primary mb-2">
                support@busbooker.com
              </p>
              <p className="text-sm text-gray-500">For non-urgent inquiries</p>
            </div>
          </div>

          {/* FAQs Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <HelpCircle className="h-6 w-6 text-primary mr-2" />
              <h3 className="text-2xl font-semibold">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors"
                >
                  <h4 className="text-lg font-medium mb-2">{faq.question}</h4>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline" className="mt-4">
                <FileText className="h-4 w-4 mr-2" />
                View All FAQs
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-2xl font-semibold mb-6">Send Us a Message</h3>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="">Select a topic</option>
                  <option value="booking">Booking Issue</option>
                  <option value="refund">Refund Request</option>
                  <option value="account">Account Help</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-32"
                  placeholder="Please describe your issue or question in detail..."
                ></textarea>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Send Message</Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Support;
