import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Recover from './pages/Recover';
import RecoverConfirmation from './pages/RecoverConfirmation';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/users/me' element={<Home />}/>
        <Route path='/conta/registro' element={<Register />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/login/recuperacao' element={<Recover />}/>
        <Route path='/login/recuperacao/confirmacao' element={<RecoverConfirmation />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App