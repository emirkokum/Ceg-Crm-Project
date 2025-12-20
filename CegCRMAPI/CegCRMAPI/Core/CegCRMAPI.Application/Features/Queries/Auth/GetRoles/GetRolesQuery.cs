using MediatR;
using Microsoft.AspNetCore.Identity;
using CegCRMAPI.Domain.Entities;

namespace CegCRMAPI.Application.Features.Queries.Auth.GetRoles;

public record GetRolesQuery : IRequest<List<string>>;

public class GetRolesQueryHandler : IRequestHandler<GetRolesQuery, List<string>>
{
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;

    public GetRolesQueryHandler(RoleManager<IdentityRole<Guid>> roleManager)
    {
        _roleManager = roleManager;
    }

    public async Task<List<string>> Handle(GetRolesQuery request, CancellationToken cancellationToken)
    {
        var roles = await Task.FromResult(_roleManager.Roles.Select(r => r.Name).ToList());
        return roles;
    }
} 