import { useEffect } from "react";
import { generatePath, Outlet, useNavigate, useParams } from "react-router-dom";
import useHubConnection from "../services/use-hub-connection.hook";
import ParticipantList from "./ParticipantList";

const Room = () => {
  const { roomid } = useParams();
  const connection = useHubConnection()
  const navigate = useNavigate()

  useEffect(() => {
    window.addEventListener("beforeunload", () => connection.leaveRoomAsync());
  })

  useEffect(() => {
    if (!roomid) {
      return
    }

    connection.enterRoomAsync(roomid)
  }, [connection, roomid])

  useEffect(() => {
    const subscription = connection.getNavigationUpdate().subscribe(update => {
      console.log(update)
      switch (update.phase) {
        case 'backlog':
          navigate('./backlog');
          break;
        case 'poker':
          navigate(generatePath('./poker/:storyid', { storyid: update.storyId }))
          break;
        default:
          break;
      }
    })
    return () => subscription.unsubscribe()
  }, [connection, navigate])
    
  const toLobby = async () => {
    await connection.leaveRoomAsync()
    navigate('/lobby')
  }

  return (
    <>
      <h2>Room {roomid}</h2>
      <button onClick={toLobby}>BackToLobby</button>
      <Outlet />
      <ParticipantList />
    </>
  );
}

export default Room;