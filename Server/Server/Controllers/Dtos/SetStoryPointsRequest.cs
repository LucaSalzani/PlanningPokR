namespace Server.Controllers.Dtos
{
    public class SetStoryPointsRequest
    {
        public string StoryKey { get; set; }

        public int StoryPoints { get; set; }
    }
}