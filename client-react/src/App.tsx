import './App.css';
import { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './login/Login';
import Lobby from './lobby/Lobby';
import Room from './room/Room';
import Backlog from './room/Backlog';
import Poker from './room/Poker';
import RequireAuth from './services/require-auth';
import AuthProvider from './services/auth-context';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/lobby" element={<RequireAuth><Lobby /></RequireAuth>} />
            <Route path="/room/:roomid" element={<RequireAuth><Room /></RequireAuth>}>
              <Route path="backlog" element={(<Backlog />)} />
              <Route path="poker" element={(<Poker />)} />
              <Route index element={(<Backlog />)} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );
  }
}

export default App;
