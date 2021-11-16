import { useState } from 'react';
import { useNavigate } from 'react-router';
import useAuth from '../services/use-auth.hook';

 
const Login = () => {

  const [userName, setUserName] = useState('')
  const navigate = useNavigate()
  const auth = useAuth()

  const handleLogin = async () => {
    await auth.login(userName)
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