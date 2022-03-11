import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Launch from './Components/Launch'
import Summary from './Components/Summary';
import Nav from './Components/Nav';
import About from './Components/About';

function App() {
  return (
    <BrowserRouter>
    <Nav/>
      <Routes>
        <Route exact path='/' element={<Launch/>}/>
        <Route exact path='/summary' element={<Summary/>}/>
        <Route exact path='/about' element={<About/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
