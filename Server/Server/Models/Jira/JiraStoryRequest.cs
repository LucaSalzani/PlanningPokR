using System.Collections.Generic;

namespace Server.Models.Jira
{
    public class JiraStoryRequest
    {
        public string Jql { get; set; }
        public int MaxResults { get; set; }
        public List<string> Fields { get; set; }
    }
}