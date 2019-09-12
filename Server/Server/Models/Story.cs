namespace Server.Models
{
    public class Story
    {
        public string StoryId { get; set; }
        public string Title { get; set; }
        public string RoomId { get; set; }
        public int? AcceptedVote { get; set; }
    }
}