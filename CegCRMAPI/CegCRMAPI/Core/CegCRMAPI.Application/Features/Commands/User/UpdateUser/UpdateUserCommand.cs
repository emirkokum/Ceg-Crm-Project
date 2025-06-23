using AutoMapper;
using CegCRMAPI.Application.DTOs.Auth;
using CegCRMAPI.Application.Exceptions;
using CegCRMAPI.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace CegCRMAPI.Application.Features.Commands.User.UpdateUser;

public record UpdateUserCommand : IRequest<UserDto>
{
    public Guid Id { get; init; }
    public string Email { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string? Role { get; init; }
}

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, UserDto>
{
    private readonly UserManager<Domain.Entities.User> _userManager;
    private readonly IMapper _mapper;

    public UpdateUserCommandHandler(
        UserManager<Domain.Entities.User> userManager,
        IMapper mapper)
    {
        _userManager = userManager;
        _mapper = mapper;
    }

    public async Task<UserDto> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.Id.ToString());
        if (user == null)
        {
            throw new NotFoundException("User", request.Id);
        }

        user.Email = request.Email;
        user.UserName = request.Email;
        user.FirstName = request.FirstName;
        user.LastName = request.LastName;

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            var errors = updateResult.Errors.ToDictionary(
                e => e.Code,
                e => new[] { e.Description }
            );
            throw new ValidationException(errors);
        }

        if (!string.IsNullOrEmpty(request.Role))
        {
            var currentRoles = await _userManager.GetRolesAsync(user);
            if (currentRoles.Any())
            {
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
            }
            
            var roleResult = await _userManager.AddToRoleAsync(user, request.Role);
            if (!roleResult.Succeeded)
            {
                var errors = roleResult.Errors.ToDictionary(
                    e => e.Code,
                    e => new[] { e.Description }
                );
                throw new ValidationException(errors);
            }
        }

        var roles = await _userManager.GetRolesAsync(user);
        var userDto = _mapper.Map<UserDto>(user);
        userDto.Role = roles.FirstOrDefault();

        return userDto;
    }
} 