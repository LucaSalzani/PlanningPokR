import { VotingOption } from './votion-option.model';

export interface RoomSettingsUpdate {
  teamJiraLabel: string;
  votingOptions: VotingOption[];
}
