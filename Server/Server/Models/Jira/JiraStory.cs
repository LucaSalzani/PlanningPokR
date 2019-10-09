namespace Server.Models.Jira
{
    public class JiraStory
    {
        public string Key { get; set; }

        public JiraStoryFields Fields { get; set; }
    }
}