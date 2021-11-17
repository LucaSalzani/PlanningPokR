import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { VotingOption } from "../models/votion-option.model";
import useHubConnection from "../services/use-hub-connection.hook";

const Poker = () => {
  const { roomid, storyid } = useParams()
  const [areVotesRevealed, setAreVotesRevealed] = useState(false)
  const [votes, setVotes] = useState<(number | null)[]>([])
  const connection = useHubConnection()

  useEffect(() => {
    const subscription = connection.getParticipantsStateUpdate().subscribe(update => {
      setAreVotesRevealed(update.areVotesRevealed)
      setVotes(update.participants.map(p => p.vote))
    })
    return () => subscription.unsubscribe()
  }, [connection])

  const votingOptions: VotingOption[] = [
    { value: 1, displayName: '1', isActive: true },
    { value: 2, displayName: '2', isActive: true },
    { value: 3, displayName: '3', isActive: true },
    { value: 5, displayName: '5', isActive: true },
    { value: 8, displayName: '8', isActive: true },
    { value: 13, displayName: '13', isActive: true },
  ]

  const handleVote = (value: number) => {
    if (!roomid) {
      throw Error('No room id specified in poker mode')
    }
    connection.selectValueAsync(value, roomid)
  }

  const votingOptionList = votingOptions.map(opt => <button key={opt.value} onClick={() => handleVote(opt.value)}>{opt.displayName}</button>)
  const voteResultList = votingOptions.map(opt => <li key={opt.value}>{opt.displayName}: {votes.filter(v => v === opt.value).length}</li>)
  voteResultList.push(<li key={-1}>No Vote: {votes.filter(v => !v).length}</li>)

  const PokerElement = () => {
    if (areVotesRevealed){
      return <><ul>{voteResultList}</ul></>
    } else {
      return <>{votingOptionList}</>
    }
  }

  return (
    <>
      <h2>Poker {storyid}</h2>
      <PokerElement />
    </>
  );
}

export default Poker;