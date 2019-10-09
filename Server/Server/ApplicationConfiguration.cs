namespace Server
{
    public class ApplicationConfiguration
    {
        public string[] FrontendUrls { get; set; }

        public string CommunicationHubPath { get; set; }

        public string JiraJql { get; set; }

        public int JiraMaxResults { get; set; }

        public string JiraStoryPointsFieldName { get; set; }

        public string JiraUserName { get; set; }

        public string JiraBaseUrl { get; set; }
    }
}
