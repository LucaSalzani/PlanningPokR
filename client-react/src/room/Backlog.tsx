import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { Story } from "../models/story.model"
import useHubConnection from "../services/use-hub-connection.hook"

const Backlog = () => {
  const [stories, setStories] = useState<Story[]>([])
  const connection = useHubConnection()
  const { roomid } = useParams();

  useEffect(() => {
    const subscription = connection.getStoryStateUpdate().subscribe(update => {
      console.log(update)
      setStories([...update.stories])
    })
    return () => subscription.unsubscribe()
  }, [connection])

  const storyListItems = stories.filter(s => s.roomId === roomid).map(s => <li>{s.storyId}</li>)

  return (
    <><h2>Backlog</h2><ul>
      {storyListItems}
    </ul></>
  );
}

export default Backlog;