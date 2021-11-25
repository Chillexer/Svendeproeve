using CsvHelper;
using CsvHelper.Configuration;
using FNO.DataAccess.Database.Models;
using FNO.DataAccess.Database.Repos;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.Json;
using static FNO.DataAccess.Database.Models.Enums;

namespace FNO.DataAccess.Database.Data
{
    public class PrepDb
    {
        public static void PrepPopulation(IApplicationBuilder app)
        {
            using var serviceScope = app.ApplicationServices.CreateScope();
            var context = serviceScope.ServiceProvider.GetService<ShopDbContext>();
            if (context == null)
#pragma warning disable CA2208 // Instantiate argument exceptions correctly
                throw new ArgumentNullException(nameof(context));
#pragma warning restore CA2208 // Instantiate argument exceptions correctly

            SeedData(context);
        }

        private static void SeedData(ShopDbContext context)
        {
            DateTime startTime = DateTime.Now;
            Console.WriteLine("--> Attempting to apply migrations....");
            try
            {
                context.Database.Migrate();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"--> Could not run migrations: {ex.Message}");
            }

            if (!context.Categories.Any())
            {
                Console.WriteLine("--> Seeding Categories...");

                Assembly assembly = Assembly.GetExecutingAssembly();
                string reourceName = "FNO.DataAccess.Database.Data.SeedData.Categories.csv";
                using (Stream stream = assembly.GetManifestResourceStream(reourceName))
                {
                    using var reader = new StreamReader(stream, Encoding.UTF8);
                    CsvConfiguration configuration = new(CultureInfo.InvariantCulture)
                    {
                        Delimiter = ";"
                    };

                    CsvReader csvReader = new(reader, configuration);

                    var categories = csvReader.GetRecords<Category>().ToArray();

                    foreach (Category category in categories)
                    {
                        category.Id = default;
                    }

                    context.Categories.AddRange(categories);
                }

                context.SaveChanges();
            }
            else
            {
                Console.WriteLine("--> We already have Categories");
            }

            if (!context.Colors.Any())
            {
                Console.WriteLine("--> Seeding Colors...");

                Assembly assembly = Assembly.GetExecutingAssembly();
                string reourceName = "FNO.DataAccess.Database.Data.SeedData.Colors.csv";
                using (Stream stream = assembly.GetManifestResourceStream(reourceName))
                {
                    using var reader = new StreamReader(stream, Encoding.UTF8);
                    CsvConfiguration configuration = new(CultureInfo.InvariantCulture)
                    {
                        Delimiter = ";"
                    };

                    CsvReader csvReader = new(reader, configuration);

                    var colors = csvReader.GetRecords<Color>().ToArray();

                    foreach (Color color in colors)
                    {
                        color.Id = default;
                    }

                    context.Colors.AddRange(colors);
                }

                context.SaveChanges();
            }
            else
            {
                Console.WriteLine("--> We already have Colors");
            }

            if (!context.Genders.Any())
            {
                Console.WriteLine("--> Seeding Genders...");

                Assembly assembly = Assembly.GetExecutingAssembly();
                string reourceName = "FNO.DataAccess.Database.Data.SeedData.Genders.csv";
                using (Stream stream = assembly.GetManifestResourceStream(reourceName))
                {
                    using var reader = new StreamReader(stream, Encoding.UTF8);
                    CsvConfiguration configuration = new(CultureInfo.InvariantCulture)
                    {
                        Delimiter = ";"
                    };

                    CsvReader csvReader = new(reader, configuration);

                    var genders = csvReader.GetRecords<Gender>().ToArray();

                    foreach (Gender gender in genders)
                    {
                        gender.Id = default;
                    }

                    context.Genders.AddRange(genders);
                }

                context.SaveChanges();
            }
            else
            {
                Console.WriteLine("--> We already have Genders");
            }

            if (!context.Sizes.Any())
            {
                Console.WriteLine("--> Seeding Sizes...");

                Assembly assembly = Assembly.GetExecutingAssembly();
                string reourceName = "FNO.DataAccess.Database.Data.SeedData.Sizes.csv";
                using (Stream stream = assembly.GetManifestResourceStream(reourceName))
                {
                    using var reader = new StreamReader(stream, Encoding.UTF8);
                    CsvConfiguration configuration = new(CultureInfo.InvariantCulture)
                    {
                        Delimiter = ";"
                    };

                    CsvReader csvReader = new(reader, configuration);

                    var sizes = csvReader.GetRecords<Size>().ToArray();

                    foreach (Size size in sizes)
                    {
                        size.Id = default;
                    }

                    context.Sizes.AddRange(sizes);
                }

                context.SaveChanges();
            }
            else
            {
                Console.WriteLine("--> We already have Sizes");
            }


            if (!context.Products.Any())
            {
                Console.WriteLine("--> Seeding Products and Variants...");

                Assembly assembly = Assembly.GetExecutingAssembly();
                string resourceName = "FNO.DataAccess.Database.Data.SeedData.ProductsAndVariants.json";
                using Stream stream = assembly.GetManifestResourceStream(resourceName);
                using var reader = new StreamReader(stream, Encoding.UTF8);
                List<ProductSeedModel> products = JsonSerializer.Deserialize<List<ProductSeedModel>>(reader.ReadToEnd());

                CategoryRepo categoryRepo = new(context);
                SizeRepo sizeRepo = new(context);

                var count = products.Count - 1;

                foreach (var item in products.Select((value, i) => new { i, value }))
                {
                    var product = item.value;

                    if (item.i > 0)
                        Console.SetCursorPosition(Console.CursorLeft, Console.CursorTop > 0 ? Console.CursorTop : (Console.CursorTop + 1) - 1);
                    var procent = Math.Round(Decimal.Divide(item.i, count) * 100m, 2).ToString();
                    Console.WriteLine($"--> {procent}% Completed...");

                    List<Category> validCategories = new();

                    if (string.IsNullOrWhiteSpace(product.Description))
                        product.Description = "😘";

                    if (string.IsNullOrWhiteSpace(product.Model))
                        product.Model = "Test";

                    foreach (var category in product.Categories)
                    {
                        var task = categoryRepo.SearchByNameAsync(product.Gender, category);
                        task.Wait();

                        if (task.Result.Count > 0)
                        {
                            var c = categoryRepo.GetCategoryByIdAsync(task.Result.FirstOrDefault().Id);
                            c.Wait();
                            validCategories.Add(c.Result);
                        }
                    }

                    if (validCategories.Count == 0)
                        continue;

                    var firstCategory = validCategories.FirstOrDefault();

                    List<Variant> variants = new();

                    foreach (var variant in product.Variants)
                    {
                        if (string.IsNullOrWhiteSpace(variant.ImageUrl))
                            continue;

                        Color color = context.Colors.FirstOrDefault(c => c.ColorName == variant.Color);

                        var task = sizeRepo.GetSizesBySizeType(GetSizeTypeFromCategory(firstCategory.CategoryName));
                        task.Wait();

                        List<Size> sizes = task.Result;
                        List<InventoryInfo> inventory = new();

                        foreach (var size in sizes)
                        {
                            var ran = new Random();
                            var inventoryInfo = new InventoryInfo()
                            {
                                Size = size,
                                TotalAmount = ran.Next(100),
                            };

                            inventory.Add(inventoryInfo);
                        }

                        variants.Add(new Variant()
                        {
                            Colors = new List<Color>() { color },
                            DiscountPrice = variant.DiscountPrice,
                            ImagePath = variant.ImageUrl,
                            InventoryInfos = inventory,
                        });
                    }

                    var newProduct = new Product()
                    {
                        Brand = product.Brand,
                        Description = product.Description,
                        Gender = context.Genders.FirstOrDefault(g => g.GenderName == product.Gender),
                        Model = product.Model,
                        Price = product.Price,
                        SizeType = GetSizeTypeFromCategory(firstCategory.CategoryName),
                        Categories = new List<Category>(validCategories),
                        Variants = variants
                    };

                    context.Products.Add(newProduct);
                }

                Console.WriteLine("--> Saving changes");
                context.SaveChanges();
            }
            else
            {
                Console.WriteLine("--> We already have Products and Variants");
            }

            var timeSpan = DateTime.Now - startTime;
            var timeSpanText = $"-->Migrations completed. It took {timeSpan.Minutes} minutes and {timeSpan.Seconds} seconds";
            Console.WriteLine(timeSpanText);
        }

        private static SizeType GetSizeTypeFromCategory(string category)
        {
            return category switch
            {
                "Sneakers" => SizeType.Shoes,
                "Andre Sportssko" => SizeType.Shoes,
                "Løbesko" => SizeType.Shoes,
                "Lifestyle Trainers" => SizeType.Shoes,
                "Træningssko" => SizeType.Shoes,
                "Vintersko" => SizeType.Shoes,
                "Toppe" => SizeType.Shirt,
                "T-Shirts" => SizeType.Shirt,
                "Bukser" => SizeType.Pants,
                "Tights" => SizeType.Pants,
                "Jakker" => SizeType.Jackets,
                "Hættetrøjer" => SizeType.Shirt,
                "Joggingbukser" => SizeType.Pants,
                "Træningsbukser" => SizeType.Pants,
                "Træningsdragter" => SizeType.Shirt,
                "Nederdele og Kjoler" => SizeType.Shirt,
                "Sports-bh'er" => SizeType.Shirt,
                "Spillertrøjer" => SizeType.Shirt,
                "Strømper" => SizeType.Shirt,
                "Sweatshirts" => SizeType.Shirt,
                "Shorts" => SizeType.Shorts,
                "Træningstrøjer" => SizeType.Shirt,
                "Sweatsuits" => SizeType.Shirt,
                "Gymnastikdragter" => SizeType.Shirt,
                "Buksedragt og heldragt" => SizeType.Shirt,
                "Kits" => SizeType.OneSize,
                "Tasker" => SizeType.OneSize,
                "Baselayers" => SizeType.Shirt,
                "Bib Shorts & Bib Tights" => SizeType.Shorts,
                "Badetøj" => SizeType.Shirt,
                "Polotrøjer" => SizeType.Shirt,
                "Sæt" => SizeType.Shirt,
                "Hovedbeklædning" => SizeType.OneSize,
                "Klip klapper" => SizeType.Shoes,
                "High Top Sneakers" => SizeType.Shoes,
                "Støvler" => SizeType.Shoes,
                "Tørklæder" => SizeType.OneSize,
                "Svømmetilbehør" => SizeType.OneSize,
                "Udstyr" => SizeType.OneSize,
                "Skotilbehør" => SizeType.OneSize,
                "Handsker" => SizeType.OneSize,
                "Yoga Mat" => SizeType.OneSize,
                "Fodboldstøvler" => SizeType.Shoes,
                "Hockeystave" => SizeType.OneSize,
                "Undertøj" => SizeType.Shorts,
                "Bælter" => SizeType.Belt,
                "Pumpetilbehør" => SizeType.OneSize,
                "Bolde" => SizeType.OneSize,
                _ => SizeType.OneSize,
            };
        }
    }
}
