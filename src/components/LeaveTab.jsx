import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './leaveTab.css'
import LeaveForm from './HandleLeave';
import { FaRegEdit } from "react-icons/fa";
import EditStatusForm from './EditStatusForm';


const LeaveTab = () => {

  const [data,setData] = useState([])
  const [showLeaveForm,setShowLeaveForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false);
  const [leaveId, setleaveId] = useState(null);

  async function fetchPartnerLeaveDetails() {
    try {
      let response = await axios.get('https://sploot-backend.vercel.app/api/partners/leaves');
      let data = response?.data?.data?.partners
      setData(data)
      console.log("data===>", data);
    } catch (err) {
      console.log("err===>", err);
    }
  }

  function getFormatedDate(isoDate){

      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date(isoDate));
      return formattedDate

  }

  function handleEdit (e,leave_id){
    console.log("leave_id===>",leave_id)
    setShowEditModal(p=>!p)
    setleaveId(leave_id)
  }
    

  useEffect(() => {
    
    fetchPartnerLeaveDetails()
    
  }, [showLeaveForm,showEditModal]);

  return (
    <div>
    {showEditModal && <EditStatusForm setShowEditModal={setShowEditModal} leaveId={leaveId}/> }
    {(!showEditModal &&  showLeaveForm) &&
    <LeaveForm
      setShowLeaveForm = {setShowLeaveForm}
    />}
      <div className='heading-box'>
        <h1>Leave</h1>
      </div>

      <div className='add-leave-box'>
        <button onClick={(e)=>{setShowLeaveForm(true)}}>Add Leave</button>
      </div>

        <table>
            <tr>
                <th>Name</th>
                <th>City</th>
                <th>Applied Date</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
            {
             data && data.map((ele)=>{
                return (
                  <tr>
                    <td>{ele.partnerName}</td>
                    <td>{ele.partnerCity}</td>
                    <td>{getFormatedDate(ele.createdAt)}</td>
                    <td>{getFormatedDate(ele.startDate)}</td>
                    <td>{getFormatedDate(ele.endDate)}</td>
                    <td className={ele.status=='APPROVED' ? "status-approved" : "status-pending"}>{ele.status}</td>
                    <td><FaRegEdit onClick={(e) => handleEdit(e, ele.leaveId)} /></td>
                  </tr>
                )
              })
            }
        </table>
      </div>
  );
};

export default LeaveTab;
