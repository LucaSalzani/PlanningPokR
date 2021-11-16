import { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
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

  const toPoker = () => {
    navigate('./poker')
  }

  const toBacklog = () => {
    navigate('./backlog')
  }

  return (
    <>
      <h2>Room {roomid}</h2>
      <button onClick={toPoker}>Poker</button>
      <button onClick={toBacklog}>Backlog</button>
      <Outlet />
      <ParticipantList />
    </>
  );
}

export default Room;