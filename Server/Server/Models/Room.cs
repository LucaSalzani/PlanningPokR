using System.Collections.Generic;

namespace Server.Models
{
    public class Room
    {
        public string RoomId { get; set; }

        public string RoomName { get; set; }

        public List<string> Stories { get; set; }

        public bool AreVotesRevealed { get; set; }

        public Phase Phase { get; set; }
    }
}
