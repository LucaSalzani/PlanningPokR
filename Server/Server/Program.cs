using System;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args)
        {
            var portEnvVariable = Environment.GetEnvironmentVariable("PORT");
            var webHostBuilder = WebHost.CreateDefaultBuilder(args).UseStartup<Startup>();
            return portEnvVariable == null 
                ? webHostBuilder 
                : webHostBuilder.UseUrls("http://*:" + Environment.GetEnvironmentVariable("PORT"));
        }
    }
}
