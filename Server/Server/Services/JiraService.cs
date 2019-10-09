using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Server.Models.Jira;

namespace Server.Services
{
    public class JiraService : IJiraService
    {
        private readonly string jiraPassword = Environment.GetEnvironmentVariable("PLANNINGPOKR_JIRAPASSWORD");

        private readonly ILogger<JiraService> logger;
        private readonly IOptions<ApplicationConfiguration> config;

        public JiraService(ILogger<JiraService> logger, IOptions<ApplicationConfiguration> config)
        {
            this.logger = logger;
            this.config = config;
        }

        public async Task<List<JiraStory>> GetStoriesByTeamLabelAsync(string label)
        {
            var jql = string.Format(config.Value.JiraJql, label);
            var request = new JiraStoryRequest
            {
                Jql = jql,
                MaxResults = config.Value.JiraMaxResults,
                Fields = new List<string>
                {
                    "summary"
                }
            };

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", GetEncodedBase64AuthenticationValue());

                var requestString = JsonConvert.SerializeObject(request, Formatting.None, new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver()});
                var content = new StringContent(requestString, Encoding.UTF8, "application/json");

                var response = await httpClient.PostAsync($"{config.Value.JiraBaseUrl}rest/api/2/search", content); // TODO: Error Handing (Status code)

                if (!response.IsSuccessStatusCode)
                {
                    logger.LogWarning($"Jira search request returned status code {(int)response.StatusCode}");
                    return null;
                }

                var responseString = await response.Content.ReadAsStringAsync();

                var searchResult = JsonConvert.DeserializeObject<JiraSearchResult>(responseString);
                return searchResult.Issues;
            }
        }
        
        public async Task<string> GetCustomFieldIdByNameAsync(string name)
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", GetEncodedBase64AuthenticationValue());

                string response;
                try
                {
                    response = await httpClient.GetStringAsync($"{config.Value.JiraBaseUrl}rest/api/2/field");
                }
                catch (WebException e)
                {
                    logger.LogWarning($"Jira custom field request returned error {e.Status}", e);
                    return null;
                }

                var fields = JsonConvert.DeserializeObject<JiraField[]>(response);
                return fields.SingleOrDefault(f => f.Name == name)?.Id;
            }
        }

        private string GetEncodedBase64AuthenticationValue()
        {
            return Convert.ToBase64String(Encoding.GetEncoding("ISO-8859-1").GetBytes($"{config.Value.JiraUserName}:{jiraPassword}"));
        }
    }
}
