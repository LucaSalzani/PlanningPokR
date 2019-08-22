namespace Server.Communication
{
    public class VotingStateUpdate
    {
        public string Status { get; set; } // TODO: Use Enum

        public string[] Voters { get; set; }
    }
}
