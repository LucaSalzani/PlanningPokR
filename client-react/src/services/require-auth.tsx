import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "./auth-context";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
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

  if (!auth.user) {
    return null
  }

  return children
}

export default RequireAuth