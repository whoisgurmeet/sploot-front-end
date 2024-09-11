import React from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  const goToWalkers = () => {
    navigate('/walker-tab');
  };

  const goToLeave = () => {
    navigate('/leave-tab');
  };

  return (
    <div className="landing-page">
      <div className="section walker-list" onClick={goToWalkers}>
        <h2>Walker List</h2>
      </div>
      <div className="section leave-page" onClick={goToLeave}>
        <h2>Leave Page</h2>
      </div>
    </div>
  );
}

export default LandingPage