using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Server.Services
{
    public class JiraService : IJiraService
    {
        private readonly string jiraPassword = Environment.GetEnvironmentVariable("PLANNINGPOKR_JIRAPASSWORD");

        public async Task<List<JiraStory>> GetStoriesByTeamLabelAsync(string label)
        {
            var request = new JiraStoryRequest
            {
                Jql = $"project = 'DiAS Digital Advisory Suite' AND type = Story AND labels = {label} AND status = New ORDER BY updatedDate DESC",
                MaxResults = 15,
                Fields = new List<string>
                {
                    "summary"
                }
            };

            using (var httpClient = new HttpClient())
            {
                var encoded = Convert.ToBase64String(System.Text.Encoding.GetEncoding("ISO-8859-1").GetBytes($"dias_agileplanner:{jiraPassword}"));
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", encoded);

                var response = await httpClient.PostAsJsonAsync("https://jira.sehlat.io/rest/api/2/search", request); // TODO: Error Handing (Status code)

                var responseString = await response.Content.ReadAsStringAsync();

                var searchResult = JsonConvert.DeserializeObject<JiraSearchResult>(responseString);
                return searchResult.Issues;
            }
        }
        
        public async Task<string> GetCustomFieldIdByNameAsync(string name)
        {
            using (var httpClient = new HttpClient())
            {
                var encoded = Convert.ToBase64String(System.Text.Encoding.GetEncoding("ISO-8859-1").GetBytes($"dias_agileplanner:{jiraPassword}"));
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", encoded);

                var response = await httpClient.GetStringAsync("https://jira.sehlat.io/rest/api/2/field");

                var fields = JsonConvert.DeserializeObject<JiraField[]>(response);
                return fields.SingleOrDefault(f => f.Name == name)?.Id;
            }
        }
    }

    public class JiraSearchResult
    {
        public List<JiraStory> Issues { get; set; }
    }

    public class JiraStory
    {
        public string Key { get; set; }

        public JiraStoryFields Fields { get; set; }
    }

    public class JiraStoryFields
    {
        public string Summary { get; set; }
    }

    public class JiraStoryRequest
    {
        public string Jql { get; set; }
        public int MaxResults { get; set; }
        public List<string> Fields { get; set; }
    }

    public class JiraField
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}
