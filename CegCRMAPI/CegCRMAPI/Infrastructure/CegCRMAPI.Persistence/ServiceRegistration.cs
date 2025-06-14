using CegCRMAPI.Infrastructure.Repositories;
using CegCRMAPI.Persistence.Context;
using CegCRMAPI.Persistence.Repositories;
using CegCRMAPI.Persistence.Seeds;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using CegCRMAPI.Application.Interfaces.Services;
using CegCRMAPI.Application.Services.Ai;

namespace CegCRMAPI.Persistence
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<CegCrmDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<ICustomerRepository, CustomerRepository>();
            services.AddScoped<IEmployeeRepository, CegCRMAPI.Infrastructure.Repositories.EmployeeRepository>();
            services.AddScoped<IInteractionRepository, InteractionRepository>();
            services.AddScoped<ITaskRepository, TaskRepository>();
            services.AddScoped<ITicketRepository, TicketRepository>();
            services.AddScoped<ILeadRepository, LeadRepository>();
            services.AddScoped<ISaleRepository, SaleRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<INoteRepository, NoteRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddHttpClient<IAiService,AiService>();

            // Configure Identity
            services.AddIdentity<User, IdentityRole<Guid>>(options =>
            {
                // Password settings
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 8;

                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
                options.Lockout.MaxFailedAccessAttempts = 5;

                // User settings
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<CegCrmDbContext>()
            .AddDefaultTokenProviders();

            return services;
        }
    }
}
