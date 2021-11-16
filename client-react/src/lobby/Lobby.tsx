import { useEffect } from "react";
import authService from "../services/auth.service";
import useHubConnection from "../services/use-hub-connection.hook";

 
const Lobby = () => {

    const connection = useHubConnection()
    
    useEffect(() => {
        const subscription = connection.getParticipantsStateUpdate().subscribe(update => console.log(update))
        return () => subscription.unsubscribe()
    }, [connection])

    const enterRoom = async () => {
        await connection.enterRoomAsync('anubis')
    }

    return ( <> 
    <h2>Lobby {authService.userName}</h2> 
    <button onClick={enterRoom}>Enter</button>
    </>);
}
 
export default Lobby;