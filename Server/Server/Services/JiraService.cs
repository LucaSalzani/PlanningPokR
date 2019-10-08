using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Server.Services
{
    public class JiraService
    {
        private readonly string jiraPassword = Environment.GetEnvironmentVariable("PLANNINGPOKR_JIRAPASSWORD");

        public async Task<string> GetCustomFieldIdByName(string name)
        {
            using (var httpClient = new HttpClient())
            {
                var encoded = Convert.ToBase64String(System.Text.Encoding.GetEncoding("ISO-8859-1").GetBytes($"dias_agileplanner:{jiraPassword}"));
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", encoded);

                var response = await httpClient.GetStringAsync("https://jira.sehlat.io/rest/api/2/field");

                var fields = JsonConvert.DeserializeObject<Field[]>(response);
                return fields.SingleOrDefault(f => f.Name == name)?.Id;
            }
        }
    }

    public class Field
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}
