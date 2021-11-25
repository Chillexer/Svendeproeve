using FNO.DataAccess.Database.Data;
using FNO.DataAccess.Database.Repos;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System;
using System.IO;
using System.Reflection;

namespace FNO.Shop.ShopApi
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
                        .WithOrigins("http://localhost:3001", "http://svendeproeveshop.westeurope.azurecontainer.io")
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
                        .WithOrigins("https://localhost:3031", "http://localhost:3030", "http://svendeproeveapi.westeurope.azurecontainer.io:3030", "https://svendeproeveapi.westeurope.azurecontainer.io:3031")
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                    });
            });

            services.AddDbContext<ShopDbContext>(options =>
            {
                options.UseSqlServer(Configuration["ShopDb"]);
            });

            services.AddAutoMapper(typeof(Startup));

            services.AddScoped<IProductRepo, ProductRepo>();
            services.AddScoped<ICategoryRepo, CategoryRepo>();
            services.AddScoped<IOrderRepo, OrderRepo>();
            services.AddScoped<IColorRepo, ColorRepo>();
            services.AddScoped<IGenderRepo, GenderRepo>();
            services.AddScoped<IVariantRepo, VariantRepo>();
            services.AddScoped<ISizeRepo, SizeRepo>();

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebApi", Version = "v1" });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
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
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebApi v1"));

            app.UseCors("AllowSpecificOrigin");

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
