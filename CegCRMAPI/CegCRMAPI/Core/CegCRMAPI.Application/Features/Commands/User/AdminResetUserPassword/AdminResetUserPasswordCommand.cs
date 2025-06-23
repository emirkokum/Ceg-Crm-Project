using CegCRMAPI.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Features.Commands.User.ResetUserPassword
{
    public record AdminResetUserPasswordCommand(string Email, string NewPassword) : IRequest<bool>;
    public class AdminResetUserPasswordCommandHandler : IRequestHandler<AdminResetUserPasswordCommand, bool>
    {
        private readonly UserManager<Domain.Entities.User> _userManager;

        public AdminResetUserPasswordCommandHandler(UserManager<Domain.Entities.User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<bool> Handle(AdminResetUserPasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user is null)
                return false;

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, request.NewPassword);

            return result.Succeeded;
        }
    }
}
