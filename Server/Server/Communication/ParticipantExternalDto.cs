namespace Server.Communication
{
    public class ParticipantExternalDto
    {
        public string UserId { get; set; }

        public string Name { get; set; }

        public bool HasVoted { get; set; }

        public int? Vote { get; set; }

        public bool IsModerator { get; set; }
    }
}
