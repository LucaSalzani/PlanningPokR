using System;

namespace Server.Models
{
    public class Participant
    {
        public string UserId { get; set; }

        public string ConnectionId { get; set; }

        public string RoomId { get; set; }

        public string UserName { get; set; }

        public int? Vote { get; set; }

        public bool IsModerator { get; set; }

        public DateTime LastActiveTimeStampUtc { get; set; }
    }
}
