import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../services/auth-context';
 
const Login = () => {

  const [userNameFormValue, setUserNameFormValue] = useState('')
  const navigate = useNavigate()
  const auth = useAuth()

  const handleLogin = () => {
    auth.signin(userNameFormValue, () => {
      navigate('/lobby')
    })
  }

  return (
    <>
      <h2>Login</h2>
      <input type="text" onChange={(e) => setUserNameFormValue(e.target.value)} value={userNameFormValue} />
      <button onClick={handleLogin}>Submit</button>
    </>
  );
}
 
export default Login;