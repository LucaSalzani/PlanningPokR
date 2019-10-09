using System.Collections.Generic;

namespace Server.Models.Jira
{
    public class JiraStoryPointUpdate
    {
        public Dictionary<string, int> Fields { get; set; }
    }
}