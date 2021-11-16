import './App.css';
import { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './login/Login';
import Lobby from './lobby/Lobby';
 
class App extends Component {
  render() {
    return (      
       <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/lobby" element={<Lobby />} />
          </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
