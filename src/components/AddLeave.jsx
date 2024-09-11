import React, { useState } from 'react';
import axios from 'axios';

const AddLeave = ({ partnerId }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveSlots, setLeaveSlots] = useState([{ startTime: '', endTime: '' }]);

  const handleSubmit = () => {
    setLeaveSlots([{ startTime: startDate, endTime: endDate }])
    axios.post('https://sploot-backend.vercel.app/api/leaves/add', { partnerId, startDate, endDate,leaveSlots  })
      .then(() => alert('Leave added successfully'))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h3>Add Leave</h3>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      {/* Add slots input here */}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default AddLeave;
