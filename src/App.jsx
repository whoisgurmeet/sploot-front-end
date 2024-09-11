import React from 'react';

import LeaveTab from './components/LeaveTab';
import WalkerTab from './components/WalkerTab';
import { Route , Routes} from 'react-router-dom';
import LandingPage from './pages/LandingPage';


const App = () => {
  return (
    <Routes>
        <Route path ='/' element ={<LandingPage/>} />
        <Route path ='leave-tab' element ={<LeaveTab />} />
        <Route path ='walker-tab' element ={<WalkerTab />} />
    </Routes>
  );
};

export default App;
