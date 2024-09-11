import React, { useState, useEffect } from 'react';
import './HandleLeave.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS

function LeaveForm({setShowLeaveForm}) {
  const [worker, setWorker] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSingleDay, setIsSingleDay] = useState(false);
  const [data, setData] = useState([]);
  const [slotArray, setSlotArray] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [error, setError] = useState({ startDate: '', endDate: '' });



  function convertDateToISO(dateString, timeString = "00:00:00.000Z") {
    // Create a Date object from the input date string
    const date = new Date(dateString);
  
    // Extract year, month, and day
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getUTCDate()).padStart(2, '0');
  
    // Combine with the provided time string to create the ISO format
    return `${year}-${month}-${day}T${timeString}`;
  }

  useEffect(() => {
    fetchPartnersName();
  }, []);

  useEffect(() => {
    if (worker) {
      fetchPartnersSchedule(worker);
    }
  }, [worker,startDate]);

  const fetchPartnersName = async () => {
    try {
      const response = await axios.get('https://sploot-backend.vercel.app/api/partners');
      setData(response?.data?.data?.partners || []);
    } catch (err) {
      console.error("Error fetching partners:", err);
    }
  };

  const fetchPartnersSchedule = async (workerId) => {
    try {
      const response = await axios.post('https://sploot-backend.vercel.app/api/partners/schedule', { id: workerId, day: convertDateToISO(startDate) });
      setTimeSlots(response?.data?.data?.schedule || []);
    } catch (err) {
      console.error("Error fetching partner schedule:", err);
    }
  };

  const validateDates = () => {
    const today = new Date().toISOString().split('T')[0];
    const startDateValid = startDate >= today;
    const endDateValid = endDate >= today;

    setError({
      startDate: startDateValid ? '' : 'Start date cannot be before today',
      endDate: endDateValid ? '' : 'End date must be after start date'
    });
    // return true 
    return startDateValid && endDateValid;
  };

  const handleStartDateChange = (event) => {
    setError({ startDate: '', endDate: '' })
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setError({ startDate: '', endDate: '' })
    setIsSingleDay(false)
    if(startDate == event.target.value){
      setIsSingleDay(true)
    }
    setEndDate(event.target.value);
  };

  const handleWorkerChange = (event) => {
    setWorker(event.target.value);
  };

  const handleSlotSelect = (event) => {
    const selectedSlot = event.target.value;
    if (selectedSlot) {
      const updatedSlots = [...slotArray, selectedSlot];
      setSlotArray(Array.from(new Set(updatedSlots)));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("worker===>",worker)
    if(!worker){return setError({ error: 'Select Worker First' })}
    if(isSingleDay && timeSlots.length == 0 ){return setError({ error: 'Leave Already apply Slots Not Available' })}
    if(isSingleDay && slotArray.length == 0 ){return setError({ error: 'Select Slots First' })}
    if (validateDates()) {
      try {
        console.log("body===>",{
          partnerId: worker,
          startDate,
          endDate,
          leaveSlots: slotArray
        })
        const response = await axios.post('https://sploot-backend.vercel.app/api/leaves/add', {
          partnerId: worker,
          startDate,
          endDate,
          leaveSlots: slotArray
        });
        let data = response?.data
        console.log("data==>",data)
        
        if(data.statusCode == 201){
          toast.success(data?.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
            });
      }else{
          toast.error(data?.error, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
            });
      }
        setShowLeaveForm(false)

        console.log("Leave submitted:", response.data);
        // Handle success, e.g., show a success message or redirect
      } catch (err) {
        toast.error(err?.response?.data?.error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        });
        console.log("message==>",err.message)
        console.error("Error submitting leave:", err);
        // Handle error, e.g., show an error message
      }
      setShowLeaveForm(false)
    }
  };

  return (
    <div className="form-container" onClick={(e) => {
      if (e.target.className === "form-container")
      setShowLeaveForm(false);
    }} >
      <div className="modal-box">
        <div className="header-box">Add/Edit Leave</div>
        <div className="modal">
          <form onSubmit={handleSubmit}>
          {error.error && <p className="error-message">{error.error}</p>}
            <div>
              <label>Select Worker:</label>
              <select value={worker} onChange={handleWorkerChange}>
                <option value="">Select</option>
                {data.map((ele) => (
                  <option key={ele._id} value={ele._id}>{ele.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Reason</label>
              <input type="text" />
            </div>

            <div>
              <label>Start Date:</label>
              <input type="date" value={startDate} onChange={handleStartDateChange} />
              {error.startDate && <p className="error-message">{error.startDate}</p>}
            </div>

            <div>
              <label>End Date:</label>
              <input type="date" value={endDate} onChange={handleEndDateChange} />
              {error.endDate && <p className="error-message">{error.endDate}</p>}
            </div>

            {isSingleDay && (
              <div>
                <label>Select Slot:</label>
                <select onChange={handleSlotSelect}>
                  <option value="">Select</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                <div className="time-slot-grid">
                  <label>Selected Slots:</label>
                  {slotArray.length > 0 &&
                    slotArray.map((slot, index) => (
                      <span key={index} className="time-slot">{slot}</span>
                    ))}
                </div>
              </div>
            )}

            <button type="submit">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LeaveForm;
