using System.Collections.Generic;

namespace Server.Models
{
    public class Participant
    {
        public string UserId { get; set; }

        public List<string> ConnectionIds { get; set; }

        public string RoomId { get; set; }

        public string UserName { get; set; }

        public int? Vote { get; set; }
    }
}
