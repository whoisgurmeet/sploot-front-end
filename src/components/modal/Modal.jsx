import React, { useEffect, useState } from "react";
import axios from "axios";


import "./Modal.css";

const Modal = ({ selectedWalker, closeModal }) => {



  const [timeSlots, SetTimeSlots] = useState([]);


  async function fetchPartnersSchedule() {
    try {
      let response = await axios.post(
        `https://sploot-backend.vercel.app/api/partners/schedule`,
        { id: selectedWalker, day: new Date().toISOString()}
      );

      console.log(response)
      let data = await response?.data?.data?.schedule;
      SetTimeSlots(data);
    } catch (err) {
      console.log("err===>", err);
    }
  }

  useEffect(() => {
    fetchPartnersSchedule();
  }, [selectedWalker]);

  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === "modal-container")
          closeModal("Modal was closed");
      }}
    >
      <div className="modal">
        <div
          className="modal-header"
          onClick={() => closeModal("Modal was closed")}
        >
          <div class="time-slot-grid">
            {timeSlots.map((ele) => {
              return <div class="time-slot">{ele}</div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
