using AutoMapper;
using CegCRMAPI.Application.DTOs.Auth;
using CegCRMAPI.Application.Exceptions;
using CegCRMAPI.Application.Common.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace CegCRMAPI.Application.Features.Commands.Auth.Login;

public record LoginCommand : IRequest<UserDto>
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}

public class LoginCommandHandler : IRequestHandler<LoginCommand, UserDto>
{
    private readonly UserManager<Domain.Entities.User> _userManager;
    private readonly SignInManager<Domain.Entities.User> _signInManager;
    private readonly IMapper _mapper;
    private readonly IJwtService _jwtService;

    public LoginCommandHandler(
        UserManager<Domain.Entities.User> userManager,
        SignInManager<Domain.Entities.User> signInManager,
        IMapper mapper,
        IJwtService jwtService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _mapper = mapper;
        _jwtService = jwtService;
    }

    public async Task<UserDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                { "Login", new[] { "Invalid email or password" } }
            });
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

        if (!result.Succeeded)
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                { "Login", new[] { "Invalid email or password" } }
            });
        }

        var roles = await _userManager.GetRolesAsync(user);
        
        if (!roles.Any())
        {
            var roleResult = await _userManager.AddToRoleAsync(user, "BaseUser");
            if (!roleResult.Succeeded)
            {
                throw new ValidationException(new Dictionary<string, string[]>
                {
                    { "Role", new[] { "Failed to assign default role" } }
                });
            }
            roles = new[] { "BaseUser" };
        }

        var userDto = _mapper.Map<UserDto>(user);
        userDto.Role = roles.FirstOrDefault();
        
        userDto.Token = _jwtService.GenerateToken(user.Id.ToString(), user.Email, roles);

        return userDto;
    }
} 