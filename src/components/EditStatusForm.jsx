import React, { useState, useEffect } from 'react';
import './EditStatusForm.css'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS



function EditStatusForm({setShowEditModal,leaveId}) {

    
    const [worker, setWorker] = useState('');
    const [startDate, setStartDate] = useState('2024-09-12');
    const [endDate, setEndDate] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('PENDING');
    const [timeSlot, setTimeSlot] = useState(false);

    function getFormatedDate(isoDateString) {
        // Create a Date object from the ISO date string
        const date = new Date(isoDateString);
      
        // Extract year, month, and day
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
      
        // Return the formatted date string
        return `${year}-${month}-${day}`;
      }
  
    const checkIfSameDay = (start, end) => {
        if (start && end && start === end) {
          setTimeSlot(true);
        } else {
          setTimeSlot(false);
        }
      };
    
      const handleWorkerChange = (event) => {
        setWorker(event.target.value);
      };
    
      const handleStartDateChange = (event) => {
        const newStartDate = event.target.value;
        console.log(newStartDate)
        setStartDate(newStartDate);
        checkIfSameDay(newStartDate, endDate);
      };
    
      const handleEndDateChange = (event) => {
        const newEndDate = event.target.value;
        setEndDate(newEndDate);
        checkIfSameDay(startDate, newEndDate);
      };
    
      const handleSlotSelect = (slot) => {
        setSelectedStatus(slot);
      };
    
      const handleSubmit = async (event) => {
        event.preventDefault();
        // Handle form submission logic here
        console.log("selectedStatus==>",selectedStatus)
        try{
        let response = await axios.put(`https://sploot-backend.vercel.app/api/leaves/${leaveId}`,{status:selectedStatus})
        console.log("response===>",response)
        let data = await response?.data
        console.log("data==>",data)

        if(data.statusCode == 200){
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
       }catch(err){
        toast.error(err?.response?.data?.error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        });
       }
    setShowEditModal(false)
        
      };
  
    const status_array = [
      'PENDING',
      'APPROVED',
      'DENIED',
    ];
    
    async function fetchLeaveDetails() {
        try {
          // Include the protocol in the URL
          let response = await axios.get(`https://sploot-backend.vercel.app/api/leaves/${leaveId}`);
            let data = await response?.data?.data?.leaves
          if(data){
            data = data[0]
            setEndDate(getFormatedDate(data?.endDate))
            setStartDate(getFormatedDate(data?.startDate))
            setSelectedStatus(data?.status)
          }

        } catch (err) {
          console.log("err===>", err);
        }
    }

    useEffect(()=>{
        fetchLeaveDetails()
    },[])
  
    return (
      <div className='form-container'onClick={(e) => {
        if (e.target.className === "form-container")
        setShowEditModal(false);
      }} >
      <div className='modal-box'>
       <div className='header-box'>ADD/Edit Leave</div>
       <div className='modal'>
        <form onSubmit={handleSubmit}>
        
        <div>
              <label>Select Status:</label>
              <select value={selectedStatus} onChange={(event) => handleSlotSelect(event.target.value)} disabled={ selectedStatus == 'APPROVED' ? true : false }>
                {status_array.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
        </div>
  
          <div>
            <label>Start Date:</label>
            <input type="date" value={startDate} onChange={handleStartDateChange} disabled />
          </div>
  
          <div>
            <label>End Date:</label>
            <input type="date" value={endDate} onChange={handleEndDateChange}  disabled/>
          </div>
  
        <div className='button-div'>
          <button type="submit">UPDATE</button>
        </div>
        </form>
        </div>
        </div>
      </div>
    );
  }
  

export default EditStatusForm