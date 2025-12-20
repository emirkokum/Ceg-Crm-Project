using CegCRMAPI.Persistence.Context;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CegCRMAPI.Persistence.Contexts
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<CegCrmDbContext>
    {
        public CegCrmDbContext CreateDbContext(string[] args)
        {
            var basePath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "../../Presentation/CegCRMAPI.API"));

            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json")
                .Build();

            var builder = new DbContextOptionsBuilder<CegCrmDbContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            builder.UseNpgsql(connectionString);

            return new CegCrmDbContext(builder.Options);
        }

    }
}
