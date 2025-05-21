using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CegCRMAPI.Persistence.Seeds;

public static class RoleSeeder
{
    public static async Task SeedRolesAsync(RoleManager<IdentityRole<Guid>> roleManager)
    {
        string[] roles = { "Admin", "Manager", "Employee", "SalesPerson", "Support" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
            }
        }
    }
} 