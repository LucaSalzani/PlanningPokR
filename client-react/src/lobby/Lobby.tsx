import { generatePath, useNavigate } from "react-router-dom";
import useAuth from "../services/use-auth.hook";


const Lobby = () => {

  const auth = useAuth()
  const navigate = useNavigate()

  const enterRoom = () => {
    navigate(generatePath("/room/:roomid", { roomid: 'anubis' }))
  }

  return (
    <>
      <h2>Lobby {auth.userName}</h2>
      <button onClick={enterRoom}>Enter Anubis</button>
    </>);
}

export default Lobby;