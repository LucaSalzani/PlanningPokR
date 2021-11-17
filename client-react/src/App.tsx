import './App.css';
import { Component, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from './login/Login';
import Lobby from './lobby/Lobby';
import Room from './room/Room';
import Backlog from './room/Backlog';
import Poker from './room/Poker';
import React from 'react';
import { authProvider } from './services/auth.provider';

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

interface AuthContextType {
  user: string;
  jwt: string;
  signin: (user: string, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
  tryReconnect: () => boolean;
}

let AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<string>('');
  let [jwt, setJwt] = React.useState<string>('');

  let signin = (newUser: string, callback: VoidFunction) => {
    return authProvider.signin(newUser, () => {
      setUser(newUser);
      setJwt(authProvider.jwt)
      callback();
    });
  };

  let signout = (callback: VoidFunction) => {
    return authProvider.signout(() => {
      setUser('');
      callback();
    });
  };

  let tryReconnect = () => {
    authProvider.tryReconnect(parsedUser => {
      if (!!parsedUser){
        setUser(parsedUser);
        setJwt(authProvider.jwt)
        console.log('successfully read and wrote jwt')
      }
    })
    return authProvider.isAuthenticated
  }

  let value = { user, jwt, signin, signout, tryReconnect };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}

function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth();
  let location = useLocation();
  let navigate = useNavigate();

  useEffect(() => {
    if (!auth.user) {
      const reconnectSuccessful = auth.tryReconnect()
      if (!reconnectSuccessful) {
        navigate('/login', {state: {from: location}})
      }
    }
  }, [auth, location, navigate])

  console.log('auth status: ' + auth.user)

  if (!auth.user) {
    return null
  }

  return children
}