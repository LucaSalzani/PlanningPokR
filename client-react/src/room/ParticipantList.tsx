import { useEffect, useState } from "react";
import { Participant } from "../models/participants-state-update.model";
import useHubConnection from "../services/use-hub-connection.hook";


const ParticipantList = () => {
  const [participants, setParticipants] = useState<Participant[]>([])
  const connection = useHubConnection()

  useEffect(() => {
    const subscription = connection.getParticipantsStateUpdate().subscribe(update => {
      console.log(update)
      setParticipants([...update.participants])
    })
    return () => subscription.unsubscribe()
  }, [connection])

  const partList = participants.map(p => <li key={p.userId}>{p.name}</li>)

  return (
    <>
      <h3>ParticipantList</h3>
      <ul>
        {partList}
      </ul>
    </>
  );
}

export default ParticipantList;