import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './walkerTab.css'
import Modal from './modal/Modal.jsx';

const WalkerTab = () => {
  // const [walkers, setWalkers] = useState(null);
  const [selectedWalker, setSelectedWalker] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [data,setData] = useState([])
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchPartnersName() {
    try {
      // Include the protocol in the URL
      let response = await axios.get('https://sploot-backend.vercel.app/api/partners');
      // console.log("response===>", response);
      let data = response?.data?.data?.partners
      setData(data)
      console.log("data===>", data);
    } catch (err) {
      console.log("err===>", err);
    }
  }

  useEffect(() => {
    // Fetch all walkers (partners)
    fetchPartnersName()
  }, []);

  const viewSchedule = (walkerId) => {
    // Fetch the walker's schedule
    axios.get(`/api/partners/${walkerId}/schedule`)
      .then(res => {
        setSelectedWalker(walkerId);
        setSchedule(res.data.data.schedule);
      })
      .catch(err => console.error(err));
  };

  const handleButtonClick = (value) => {
    setModalOpen(false);
    setMessage(value);
  };

  const handleClick = (id) =>{
    setSelectedWalker(id)
    setModalOpen(true);
  }

  return (
    <div>
     <table class="table-container">
           {modalOpen &&
          <Modal
            closeModal={handleButtonClick}
            onSubmit={handleButtonClick}
            onCancel={handleButtonClick}
            selectedWalker = {selectedWalker}
          >
            <h1>This is a modal</h1>
            <br />
            <p>This is the modal description</p>
          </Modal>}
    <thead>
        <tr>
            <th>Walkers</th>
            <th>Verification</th>
            <th>State/City</th>
            <th>Morning Checkin</th>
            <th>Evening Checkin</th>
            <th>Tag</th>
            <th>Rating</th>
            <th>Hotspot</th>
        </tr>
    </thead>
    <tbody>
        {data.map((ele)=>{
          console.log(ele.name)
          return( <tr>
            <td onClick={(e)=>{handleClick(ele._id)}}><span class="icon">🐕</span>{ele.name}</td>
            <td class="verification-completed">COMPLETED</td>
            <td>{ele.city}/{ele.state}</td>
            <td>-</td>
            <td>-</td>
            <td><span class="status-tag">TRAINING</span></td>
            <td>-</td>
            <td class="hotspot"><button>📅</button></td>
        </tr>)
        })}
    </tbody>
</table>
    </div>
  );
};

export default WalkerTab;
