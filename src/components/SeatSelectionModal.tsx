
import React, { useState } from "react";

const SeatSelectionModal = ({ schedule, onClose }) => {
  const totalSeats = schedule.bus.totalSeats;
  const seatsPerRow = 4;
  const numRows = totalSeats / seatsPerRow;

  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seatNumber) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((seat) => seat !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Select Your Seats</h2>

        <div className="grid grid-rows-1 gap-4">
          <div className="flex justify-between text-sm mb-2 text-gray-500">
            <div>Bus Door</div>
            <div>Front (Driver side)</div>
          </div>

          <div className="grid grid-rows-10 gap-2">
            {[...Array(numRows)].map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-5 gap-0 items-center justify-items-center"
              >
                {Array(5)
                  .fill(null)
                  .map((_, colIndex) => {
                    // Skip middle passage column
                    if (colIndex === 2) return <div key={colIndex}></div>;

                    const seatNumber =
                      rowIndex * seatsPerRow +
                      (colIndex > 2 ? colIndex - 1 : colIndex) +
                      1;

                    if (seatNumber > totalSeats) return <div key={colIndex}></div>;

                    const label = `S${seatNumber}`;
                    const isSelected = selectedSeats.includes(label);

                    return (
                      <button
                        key={colIndex}
                        onClick={() => toggleSeat(label)}
                        className={`w-12 h-12 rounded-md text-sm font-semibold ${
                          isSelected
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-right">
          <span className="text-md font-semibold">
            Selected Seats: {selectedSeats.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionModal;
