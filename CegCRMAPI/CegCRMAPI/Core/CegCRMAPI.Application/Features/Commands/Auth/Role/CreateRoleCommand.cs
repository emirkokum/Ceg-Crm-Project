using MediatR;
using Microsoft.AspNetCore.Identity;
using CegCRMAPI.Domain.Entities;

namespace CegCRMAPI.Application.Features.Commands.Auth.Role;

public record CreateRoleCommand : IRequest<bool>
{
    public string Name { get; init; } = string.Empty;
}

public class CreateRoleCommandHandler : IRequestHandler<CreateRoleCommand, bool>
{
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;

    public CreateRoleCommandHandler(RoleManager<IdentityRole<Guid>> roleManager)
    {
        _roleManager = roleManager;
    }

    public async Task<bool> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
    {
        var roleExists = await _roleManager.RoleExistsAsync(request.Name);
        if (roleExists)
        {
            return false;
        }

        var result = await _roleManager.CreateAsync(new IdentityRole<Guid>(request.Name));
        return result.Succeeded;
    }
} 