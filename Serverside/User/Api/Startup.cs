using Auth0.ManagementApi;
using FNO.Auth.Auth0Library;
using FNO.User.UserApi.Data;
using FNO.User.UserApi.IntegrationClients;
using FNO.User.UserApi.Repos;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;

namespace FNO.User.UserApi
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
            services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder =>
                    {
                        builder
                        .WithOrigins("http://localhost:3000", "http://svendeproeveadmin.westeurope.azurecontainer.io")
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                    });
            });

            services.AddCors(options =>
            {
                options.AddPolicy("AllowSwaggerUIOrigin",
                    builder =>
                    {
                        builder
                        .WithOrigins("https://localhost:3011", "http://localhost:3010", "http://svendeproeveapi.westeurope.azurecontainer.io:3010", "https://svendeproeveapi.westeurope.azurecontainer.io:3011")
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                    });
            });

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.Authority = Configuration["Auth0:Domain"];
                    options.Audience = Configuration["Auth0:Audience"];
                });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("read:messages", policy => policy.Requirements.Add(new HasScopeRequirement("read:messages", Configuration["Auth0:Domain"])));
            });


            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(Configuration["UserDb"]);
            });

            services.AddAutoMapper(typeof(Startup));

            services.AddScoped<IUserRepo, UserRepo>();
            services.AddSingleton<IManagementConnection, HttpClientManagementConnection>();
            services.AddScoped<IManagementClient, ManagementClient>();

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "UserApi", Version = "v1" });

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.OAuth2,
                    Flows = new OpenApiOAuthFlows
                    {
                        Implicit = new OpenApiOAuthFlow
                        {
                            Scopes = new Dictionary<string, string>
                            {
                                {"openid", "Open Id" }
                            },
                            AuthorizationUrl = new Uri(Configuration["Auth0:Domain"] + "authorize?audience=" + Configuration["Auth0:Audience"])
                        }
                    }
                });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);

                c.OperationFilter<SecurityRequirementsOperationFilter>();
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseHttpsRedirection();
            }
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "UserApi v1");
                c.OAuthClientId(Configuration["Auth0:SwaggerClientId"]);
            });

            app.UseCors("AllowSwaggerUIOrigin");

            PrepDb.PrepPopulation(app);

            app.UseRouting();

            app.UseCors("AllowSpecificOrigin");

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
