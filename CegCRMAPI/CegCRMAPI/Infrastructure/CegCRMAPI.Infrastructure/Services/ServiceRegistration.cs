using CegCRMAPI.Application.Common.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace CegCRMAPI.Infrastructure.Services;

public static class ServiceRegistration
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        return services;
    }
} 