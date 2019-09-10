using System.Collections.Generic;

namespace Server.Communication
{
    public class ParticipantsStateUpdate
    {
        public bool AreVotesRevealed { get; set; }

        public List<ParticipantExternalDto> Participants { get; set; }
    }
}
