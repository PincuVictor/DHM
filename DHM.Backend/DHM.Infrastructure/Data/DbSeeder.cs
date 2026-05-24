using DHM.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace DHM.Infrastructure.Data
{
    public static class DbSeeder
    {
        public static async Task SeedRolesAndAdminAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

            string[] roleNames = { "Admin", "User" };
            IdentityResult roleResult;

            foreach (var roleName in roleNames)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    roleResult = await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            var adminUser = new User
            {
                UserName = "admin@dhm.com",
                Email = "admin@dhm.com",
                FirstName = "Admin",
                LastName = "System"
            };

            var user = await userManager.FindByEmailAsync(adminUser.Email);
            if (user == null)
            {
                var createPowerUser = await userManager.CreateAsync(adminUser, "Admin123!");
                if (createPowerUser.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }

            var context = serviceProvider.GetRequiredService<DHMContext>();
            
            if (!context.Categories.Any())
            {
                var categories = new[]
                {
                    new Category { Name = "Streetwear", Description = "Urban fashion and hype clothing." },
                    new Category { Name = "Sneakers", Description = "Exclusive footwear." },
                    new Category { Name = "Accessories", Description = "Caps, bags, and more." }
                };
                context.Categories.AddRange(categories);
                await context.SaveChangesAsync();
            }

            if (!context.Products.Any())
            {
                var streetwear = context.Categories.First(c => c.Name == "Streetwear").Id;
                var sneakers = context.Categories.First(c => c.Name == "Sneakers").Id;

                var products = new[]
                {
                    new Product { 
                        Name = "Oversized Vintage Hoodie", 
                        Description = "A heavyweight, garment-dyed hoodie with a relaxed fit. Perfect for laying.", 
                        Price = 85.00m, 
                        StockQuantity = 50, 
                        CategoryId = streetwear,
                        ImageUrl = ""
                    },
                    new Product { 
                        Name = "Cargo Utility Pants", 
                        Description = "Multi-pocket tactical cargo pants made from durable ripstop cotton.", 
                        Price = 110.00m, 
                        StockQuantity = 30, 
                        CategoryId = streetwear,
                        ImageUrl = ""
                    },
                    new Product { 
                        Name = "Retro High-Top Kicks", 
                        Description = "Classic basketball-inspired high top sneakers with premium leather.", 
                        Price = 180.00m, 
                        StockQuantity = 15, 
                        CategoryId = sneakers,
                        ImageUrl = ""
                    },
                    new Product { 
                        Name = "Future Utility Vest (Upcoming Drop)", 
                        Description = "Tactical vest scheduled for our next major drop.", 
                        Price = 130.00m, 
                        StockQuantity = 0, 
                        CategoryId = streetwear,
                        ImageUrl = "",
                        ReleaseDate = DateTime.UtcNow.AddDays(7)
                    }
                };
                context.Products.AddRange(products);
                await context.SaveChangesAsync();
            }

            if (!context.Products.Any(p => p.Name == "Future Utility Vest (Upcoming Drop)"))
            {
                var streetwear = context.Categories.First(c => c.Name == "Streetwear").Id;
                context.Products.Add(new Product { 
                    Name = "Future Utility Vest (Upcoming Drop)", 
                    Description = "Tactical vest scheduled for our next major drop.", 
                    Price = 130.00m, 
                    StockQuantity = 0, 
                    CategoryId = streetwear,
                    ImageUrl = "",
                    ReleaseDate = DateTime.UtcNow.AddDays(7)
                });
                await context.SaveChangesAsync();
            }

            // Map the manually pasted images to the default products
            var existingProducts = context.Products.ToList();
            foreach (var p in existingProducts)
            {
                if (p.Name == "Oversized Vintage Hoodie" && string.IsNullOrEmpty(p.ImageUrl))
                    p.ImageUrl = "/images/products/bingu.jpg";
                else if (p.Name == "Cargo Utility Pants" && string.IsNullOrEmpty(p.ImageUrl))
                    p.ImageUrl = "/images/products/gantofu.jpg";
                else if (p.Name == "Retro High-Top Kicks" && string.IsNullOrEmpty(p.ImageUrl))
                    p.ImageUrl = "/images/products/sdingu.jpg";
            }
            await context.SaveChangesAsync();
        }
    }
}
