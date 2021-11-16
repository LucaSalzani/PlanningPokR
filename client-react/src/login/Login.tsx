import { useState } from 'react';
import { useNavigate } from 'react-router';
import authService from '../services/auth.service';

 
const Login = () => {

  const [userName, setUserName] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    await authService.login(userName)
    navigate('/lobby')
  }

  return (
    <>
      <h2>Login</h2>
      <input type="text" onChange={(e) => setUserName(e.target.value)} value={userName} />
      <button onClick={handleLogin}>Submit</button>
    </>
  );
}
 
export default Login;