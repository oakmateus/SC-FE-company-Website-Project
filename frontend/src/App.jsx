import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Recover from './pages/Recover';
import Scheduling from './pages/Scheduling';
import RecoverConfirmation from './pages/RecoverConfirmation';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/users/me' element={<Home />}/>
        <Route path='/users/me/scheduling' element={<Scheduling />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/login/recover' element={<Recover />}/>
        <Route path='/login/recover/confirmation' element={<RecoverConfirmation />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App