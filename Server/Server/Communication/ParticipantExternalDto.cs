namespace Server.Communication
{
    public class ParticipantExternalDto
    {
        public string ConnectionId { get; set; }

        public string Name { get; set; }

        public bool HasVoted { get; set; }
    }
}
