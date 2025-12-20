using System.Reflection;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace CegCRMAPI.Application;

public static class ServiceRegistration
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddMediatR(cfg => {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
        });

        return services;
    }
}