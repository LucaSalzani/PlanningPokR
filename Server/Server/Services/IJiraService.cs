using System.Collections.Generic;
using System.Threading.Tasks;
using Server.Models.Jira;

namespace Server.Services
{
    public interface IJiraService
    {
        Task<List<JiraStory>> GetStoriesByTeamLabelAsync(string label);

        Task<bool> SetStoryPointsAsync(string storyKey, int storyPoints);
    }
}