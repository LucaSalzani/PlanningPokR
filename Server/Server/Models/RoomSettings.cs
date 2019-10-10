using System.Collections.Generic;

namespace Server.Models
{
    public class RoomSettings
    {
        public string TeamJiraLabel { get; set; }

        public List<VotingOption> VotingOptions { get; set; }
    }
}