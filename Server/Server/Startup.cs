﻿using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Server.Communication;
using Server.Repositories;

namespace Server
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddCors();
            services.AddSignalR();
            services.Configure<ApplicationConfiguration>(Configuration.GetSection("ApplicationConfiguration"));

            services.AddSingleton<IParticipantRepository, ParticipantRepository>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IOptions<ApplicationConfiguration> config)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            
            app.UseCors(options => options
                .WithOrigins(config.Value.FrontendUrls)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());

            app.UseSignalR(route => route.MapHub<CommunicationHub>(config.Value.CommunicationHubPath));

            app.UseHttpsRedirection();
            app.UseMvc();
        }
    }
}
