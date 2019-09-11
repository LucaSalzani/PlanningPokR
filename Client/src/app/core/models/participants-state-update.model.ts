export interface ParticipantsStateUpdate {
  areVotesRevealed: boolean;
  participants: Participant[];
}

export interface Participant {
  userId: string;
  name: string;
  hasVoted: boolean;
  vote: number | null;
}
