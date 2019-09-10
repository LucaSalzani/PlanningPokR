export interface ParticipantsStateUpdate {
  areVotesRevealed: boolean;
  participants: Participant[];
}

export interface Participant {
  connectionId: string;
  name: string;
  hasVoted: boolean;
  vote: number | null;
}
