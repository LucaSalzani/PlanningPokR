import React from "react";
import { authProvider } from "./auth.provider";

interface AuthContextType {
  user: string;
  jwt: string;
  userid: string;
  signin: (user: string, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
  tryReconnect: () => boolean;
}

const AuthContext = React.createContext<AuthContextType>(null!);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  let [user, setUser] = React.useState<string>('');
  let [jwt, setJwt] = React.useState<string>('');
  let [userid, setUserid] = React.useState<string>('');

  let signin = (newUser: string, callback: VoidFunction) => {
    return authProvider.signin(newUser, () => {
      setUser(newUser);
      setJwt(authProvider.jwt)
      setUserid(authProvider.userId)
      callback();
    });
  };

  let signout = (callback: VoidFunction) => {
    return authProvider.signout(() => {
      setUser('');
      setJwt('');
      setUserid('');
      callback();
    });
  };

  let tryReconnect = () => {
    authProvider.tryReconnect(parsedUser => {
      if (!!parsedUser){
        setUser(parsedUser);
        setUserid(authProvider.userId);
        setJwt(authProvider.jwt)
      }
    })
    return authProvider.isAuthenticated
  }

  let value: AuthContextType = { user, jwt, userid, signin, signout, tryReconnect };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider

export function useAuth() {
  return React.useContext(AuthContext);
}

