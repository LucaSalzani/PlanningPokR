export interface ParticipantsStateUpdate {
  participants: Participant[];
}

export interface Participant {
  connectionId: string;
  name: string;
}
