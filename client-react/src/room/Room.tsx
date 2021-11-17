import { useEffect } from "react";
import { generatePath, Outlet, useNavigate, useParams } from "react-router-dom";
import useHubConnection from "../services/use-hub-connection.hook";
import ParticipantList from "./ParticipantList";

const Room = () => {
  const { roomid } = useParams();
  const connection = useHubConnection()
  const navigate = useNavigate()

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

  const toPoker = () => {
    navigate('./poker')
  }

  const toBacklog = () => {
    navigate('./backlog')
  }

  const toLobby = () => {
    navigate('/lobby')
  }

  return (
    <>
      <h2>Room {roomid}</h2>
      <button onClick={toLobby}>BackToLobby</button>
      <button onClick={toPoker}>Poker</button>
      <button onClick={toBacklog}>Backlog</button>
      <Outlet />
      <ParticipantList />
    </>
  );
}

export default Room;