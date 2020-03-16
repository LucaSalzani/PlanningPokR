using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Server.Controllers.Dtos;
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

        [HttpGet("stories")]
        public async Task<IActionResult> GetStoriesForRoom(string roomId)
        {
            var room = roomRepository.Get(roomId);

            if (room == null)
            {
                return NotFound();
            }

            var stories = await jiraService.GetStoriesByTeamLabelAsync(room.RoomSettings.TeamJiraLabel);

            if (stories == null)
            {
                return StatusCode(503, "Jira service threw an error. See log for details");
            }

            var storyDtos = stories.Select(s => new JiraStoryDto
            {
                Key = s.Key,
                Title = "(Classified)" // To declassify, return s.Fields.Summary
            });

            return Ok(storyDtos);
        }

        [HttpPost("storypoints")]
        public async Task<IActionResult> SetStoryPoints(SetStoryPointsRequest request)
        {
            var wasSuccessful = await jiraService.SetStoryPointsAsync(request.StoryKey, request.StoryPoints);

            return wasSuccessful ? Ok() : StatusCode(500);
        }
    }
}
