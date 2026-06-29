import { useState } from "react";
import { Calendar } from "react-multi-date-picker";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";


const Transaction2 = () => {
  const { user } = useSelector((state) => state);
  const navigate = useNavigate();

  const [selectedDates, setSelectedDates] = useState([]); // Stores selected dates
  const [slots, setSlots] = useState({}); // Stores time slots for each date

  // Handle Date Selection
  const handleDateChange = (dates) => {
    const formattedDates = dates.map((date) => date.format("YYYY-MM-DD"));
    setSelectedDates(formattedDates);

    // Initialize slots if not already present
    setSlots((prevSlots) => {
      const newSlots = { ...prevSlots };
      formattedDates.forEach((date) => {
        if (!newSlots[date]) newSlots[date] = [];
      });
      return newSlots;
    });
  };

  // Handle adding a time slot
  const addTimeSlot = (date) => {
    setSlots((prevSlots) => {
      const newSlots = { ...prevSlots };
      newSlots[date].push({ from: "", to: "" });
      return newSlots;
    });
  };

  // Handle updating a time slot
  const updateTimeSlot = (date, index, field, value) => {
    setSlots((prevSlots) => {
      const newSlots = { ...prevSlots };
      newSlots[date][index][field] = value;
      return newSlots;
    });
  };

  // Handle removing a time slot
  const removeTimeSlot = (date, index) => {
    setSlots((prevSlots) => {
      const newSlots = { ...prevSlots };
      newSlots[date].splice(index, 1);
      if (newSlots[date].length === 0) delete newSlots[date]; // Remove date if empty
      return newSlots;
    });
  };

  // Save & Format Data
  const saveSlots = () => {
    const formattedSlots = Object.keys(slots).map((date) => ({
      date: new Date(date).toISOString(),
      times: slots[date]
    }));
    alert("Slots saved! Check console for details.");
  };

  return (
    <PageLayout>
      <div className="App p-5">
        Transaction2
        <h2 className="text-center mb-3">Select Visit Slots</h2>

        {/* Calendar for selecting multiple dates */}
        <Calendar
          multiple
          onlyShowInRangeDates
          minDate={new Date()}
          value={selectedDates}
          onChange={handleDateChange}
        />

        {/* Display selected dates & time slots */}
        {selectedDates.length > 0 && (
          <div className="mt-4">
            <h3>Selected Dates & Time Slots:</h3>
            {selectedDates.map((date) => (
              <div key={date} className="mb-3 border p-3 rounded">
                <strong>{date}</strong>
                <button
                  onClick={() => addTimeSlot(date)}
                  className="ml-3 px-2 py-1 bg-blue-500 text-white rounded"
                >
                  + Add Slot
                </button>

                {/* Time Slot Inputs */}
                {slots[date] &&
                  slots[date].map((slot, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <input
                        type="time"
                        value={slot.from}
                        onChange={(e) => updateTimeSlot(date, index, "from", e.target.value)}
                        className="border px-2 py-1"
                      />
                      <input
                        type="time"
                        value={slot.to}
                        onChange={(e) => updateTimeSlot(date, index, "to", e.target.value)}
                        className="border px-2 py-1"
                      />
                      <button
                        onClick={() => removeTimeSlot(date, index)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        ✖
                      </button>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}

        {/* Save Slots Button */}
        <button
          onClick={saveSlots}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          Save Slots
        </button>
      </div>
    </PageLayout>
  );
};

export default Transaction2;
