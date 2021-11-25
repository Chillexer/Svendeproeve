using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;

namespace FNO.User.UserApi.Data
{
    public class PrepDb
    {
        public static void PrepPopulation(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetService<AppDbContext>();
                if (context == null)
                    throw new ArgumentNullException(nameof(context));

                SeedData(context);
            }
        }

        private static void SeedData(AppDbContext context)
        {
            Console.WriteLine("--> Attempting to apply migrations....");
            try
            {
                context.Database.Migrate();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"--> Could not run migrations: {ex.Message}");
            }

            if (!context.Users.Any())
            {
                Console.WriteLine("--> Seeding Data...");

                context.Users.AddRange(
                    new Models.User() { Auth0Id = "auth0|617fd4cd2e145b006fe58171", FirstName = "Frederik Foss", LastName = "Nielsen", Email = "frederik2812@gmail.com", Username = "frederik2812@gmail.com", ImageUrl = "https://s.gravatar.com/avatar/197b94eb8b29adf01c8a551b28a3f475?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Ffr.png", Address = "Søborg Hovedgade 137A st. tv.", Town = "Søborg", ZipCode = 2860, Phone = "29886364" },
                    new Models.User() { Auth0Id = "auth0|617fb29f7a11090068a67bbc", FirstName = "Oliver", LastName = "Orn", Email = "oliverorn@gmail.com", Username = "oliverorn@gmail.com", ImageUrl = "https://s.gravatar.com/avatar/c86611aa36176ef4930ebe79941d6893?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fol.png", Address = "Ukendt", Town = "Ukendt", ZipCode = 1234, Phone = "12345678" },
                    new Models.User() { Auth0Id = "auth0|617fe16b8eb8a600695eb3dd", FirstName = "Nicklas Thor", LastName = "Jensen", Email = "nicklasthorpaalssonjensen@gmail.com", Username = "nicklasthorpaalssonjensen@gmail.com", ImageUrl = "https://s.gravatar.com/avatar/9050768436f016ad8514fb32b706efd5?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fni.png", Address = "Ukendt", Town = "Ukendt", ZipCode = 1234, Phone = "12345678" }
                );

                context.SaveChanges();
            }
            else
            {
                Console.WriteLine("--> We already have data");
            }

        }
    }
}
