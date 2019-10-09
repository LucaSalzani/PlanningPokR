using System.Collections.Generic;

namespace Server.Models.Jira
{
    public class JiraSearchResult
    {
        public List<JiraStory> Issues { get; set; }
    }
}