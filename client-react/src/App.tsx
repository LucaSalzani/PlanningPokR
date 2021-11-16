import './App.css';
import { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './login/Login';
import Lobby from './lobby/Lobby';
import Room from './room/Room';
import Backlog from './room/Backlog';
import Poker from './room/Poker';
 
class App extends Component {
  render() {
    return (      
       <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/room/:roomid" element={<Room />}>
              <Route path="backlog" element={(<Backlog />)} />
              <Route path="poker" element={(<Poker />)} />
              <Route index element={(<Backlog />)} />
            </Route>
          </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
