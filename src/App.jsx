import React from 'react';
import './index.css'

import { Route, Routes } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Tasks from './pages/Tasks';
import Pnf from './pages/Pnf';

const App = ()=> {
  return (
   
      <Routes>
         <Route path='/'element={<Landing/>}/> 
    <Route path='/tasks/:id'element={<Tasks/>}/> 
     <Route path='/register'element={<Register/>}/>
       <Route path='/login'element={<Login/>}/>  
        <Route path='/*'element={<Pnf/>}/>
  </Routes>
  );
}

export default App;
