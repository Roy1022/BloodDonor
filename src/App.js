import React from 'react';
import { BrowserRouter,Routes,Route} from "react-router-dom";
import {Login,SignUp,Home, Home2,Home3} from "./page";
export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element = {<Login/>}/>
        <Route path = "/signup" element = {<SignUp/>}/>
        <Route path = "/" element = {<Home3/>}/>
        <Route path = "/donor" element = {<Home/>}/>
        <Route path = "/hospital" element = {<Home2/>}/>
      </Routes>
    </BrowserRouter>
  );
};