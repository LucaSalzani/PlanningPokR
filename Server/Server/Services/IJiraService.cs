using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Services
{
    public interface IJiraService
    {
        Task<List<JiraStory>> GetStoriesByTeamLabelAsync(string label);
    }
}