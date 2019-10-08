using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Server.Repositories;
using Server.Services;

namespace Server.Controllers
{
    [Route("api/jira")]
    [ApiController]
    public class JiraController : ControllerBase
    {
        private readonly IRoomRepository roomRepository;
        private readonly IJiraService jiraService;

        public JiraController(IRoomRepository roomRepository, IJiraService jiraService)
        {
            this.roomRepository = roomRepository;
            this.jiraService = jiraService;

        }

        [HttpGet] // TODO: Better route
        public async Task<IActionResult> GetStoriesForRoom(string roomId)
        {
            var jiraLabel = roomRepository.Get(roomId).JiraLabel;

            var stories = await jiraService.GetStoriesByTeamLabelAsync(jiraLabel);

            var storyDtos = stories.Select(s => new JiraStoryDto
            {
                Key = s.Key,
                Title = s.Fields.Summary
            });

            return Ok(storyDtos);
        }
    }

    public class JiraStoryDto // TODO: Extract
    {
        public string Key { get; set; }

        public string Title { get; set; }
    }
}
