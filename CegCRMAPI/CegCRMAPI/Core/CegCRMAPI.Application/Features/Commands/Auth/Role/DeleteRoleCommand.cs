using MediatR;
using Microsoft.AspNetCore.Identity;
using CegCRMAPI.Domain.Entities;

namespace CegCRMAPI.Application.Features.Commands.Auth.Role;

public record DeleteRoleCommand : IRequest<bool>
{
    public string Name { get; init; } = string.Empty;
}

public class DeleteRoleCommandHandler : IRequestHandler<DeleteRoleCommand, bool>
{
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;

    public DeleteRoleCommandHandler(RoleManager<IdentityRole<Guid>> roleManager)
    {
        _roleManager = roleManager;
    }

    public async Task<bool> Handle(DeleteRoleCommand request, CancellationToken cancellationToken)
    {
        var role = await _roleManager.FindByNameAsync(request.Name);
        if (role == null)
        {
            return false;
        }

        var result = await _roleManager.DeleteAsync(role);
        return result.Succeeded;
    }
} 