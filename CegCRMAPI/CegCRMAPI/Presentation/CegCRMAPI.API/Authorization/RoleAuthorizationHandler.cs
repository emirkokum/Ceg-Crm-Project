using CegCRMAPI.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace CegCRMAPI.API.Authorization
{
    public class RoleAuthorizationHandler : AuthorizationHandler<RoleRequirement>
    {
        private readonly UserManager<User> _userManager;

        public RoleAuthorizationHandler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        protected override async Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            RoleRequirement requirement)
        {
            var user = await _userManager.GetUserAsync(context.User);
            if (user == null)
                return;

            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Contains(requirement.Role))
            {
                context.Succeed(requirement);
            }
        }
    }

    public class RoleRequirement : IAuthorizationRequirement
    {
        public string Role { get; }

        public RoleRequirement(string role)
        {
            Role = role;
        }
    }
} 