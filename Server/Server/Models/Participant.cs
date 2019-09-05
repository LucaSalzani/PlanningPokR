namespace Server.Models
{
    public class Participant
    {
        public string ConnectionId { get; set; }

        public string Name { get; set; }

        public int? Vote { get; set; }
    }
}
