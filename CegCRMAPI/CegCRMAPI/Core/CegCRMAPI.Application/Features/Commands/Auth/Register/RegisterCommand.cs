using AutoMapper;
using CegCRMAPI.Application.DTOs;
using CegCRMAPI.Application.DTOs.Auth;
using CegCRMAPI.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace CegCRMAPI.Application.Features.Commands.Auth.Register;

public record RegisterCommand : IRequest<AuthResponseDto>
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string Department { get; init; } = string.Empty;
    public string Position { get; init; } = string.Empty;
    public string Role { get; init; } = "Employee"; // Default role
}

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponseDto>
{
    private readonly UserManager<User> _userManager;
    private readonly IMapper _mapper;

    public RegisterCommandHandler(UserManager<User> userManager, IMapper mapper)
    {
        _userManager = userManager;
        _mapper = mapper;
    }

    public async Task<AuthResponseDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var user = new User
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Department = request.Department,
            Position = request.Position,
            HireDate = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (result.Succeeded)
        {
            var roleResult = await _userManager.AddToRoleAsync(user, request.Role);
            
            if (!roleResult.Succeeded)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = $"User created but role assignment failed: {string.Join(", ", roleResult.Errors.Select(e => e.Description))}",
                    User = null
                };
            }

            var roles = await _userManager.GetRolesAsync(user);
            var userDto = _mapper.Map<UserDto>(user);
            userDto.Role = roles.FirstOrDefault();
            
            return new AuthResponseDto
            {
                Success = true,
                Message = "User registered successfully",
                User = userDto
            };
        }

        return new AuthResponseDto
        {
            Success = false,
            Message = $"Registration failed: {string.Join(", ", result.Errors.Select(e => e.Description))}",
            User = null
        };
    }
} 