using CegCRMAPI.Application.Exceptions;
using CegCRMAPI.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace CegCRMAPI.Application.Features.Commands.User.DeleteUser;

public record DeleteUserCommand : IRequest<bool>
{
    public Guid Id { get; init; }
}

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, bool>
{
    private readonly UserManager<Domain.Entities.User> _userManager;

    public DeleteUserCommandHandler(UserManager<Domain.Entities.User> userManager)
    {
        _userManager = userManager;
    }

    public async Task<bool> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.Id.ToString());
        if (user == null)
        {
            throw new NotFoundException("User", request.Id);
        }

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
        {
            var errors = result.Errors.ToDictionary(
                e => e.Code,
                e => new[] { e.Description }
            );
            throw new ValidationException(errors);
        }

        return true;
    }
} 