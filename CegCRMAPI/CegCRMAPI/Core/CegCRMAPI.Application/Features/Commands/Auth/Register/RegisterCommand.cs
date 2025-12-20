using AutoMapper;
using CegCRMAPI.Application.DTOs.Auth;
using CegCRMAPI.Application.Exceptions;
using CegCRMAPI.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;

namespace CegCRMAPI.Application.Features.Commands.Auth.Register;

public record RegisterCommand : IRequest<UserDto>
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, UserDto>
{
    private readonly UserManager<Domain.Entities.User> _userManager;
    private readonly IMapper _mapper;

    public RegisterCommandHandler(
        UserManager<Domain.Entities.User> userManager,
        IMapper mapper)
    {
        _userManager = userManager;
        _mapper = mapper;
    }

    public async Task<UserDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var user = new Domain.Entities.User
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            var errors = result.Errors.ToDictionary(
                e => e.Code,
                e => new[] { e.Description }
            );
            throw new ValidationException(errors);
        }

        var roleResult = await _userManager.AddToRoleAsync(user, "Customer");

        if (!roleResult.Succeeded)
        {
            var errors = roleResult.Errors.ToDictionary(
                e => e.Code,
                e => new[] { e.Description }
            );
            throw new ValidationException(errors);
        }

        var roles = await _userManager.GetRolesAsync(user);
        var userDto = _mapper.Map<UserDto>(user);
        userDto.Role = roles.FirstOrDefault(); 

        return userDto;
    }
} 