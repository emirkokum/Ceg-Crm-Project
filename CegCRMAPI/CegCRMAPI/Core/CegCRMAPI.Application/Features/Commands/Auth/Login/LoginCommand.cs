using AutoMapper;
using CegCRMAPI.Application.DTOs;
using CegCRMAPI.Application.DTOs.Auth;
using CegCRMAPI.Application.Exceptions;
using CegCRMAPI.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;

namespace CegCRMAPI.Application.Features.Commands.Auth.Login;

public record LoginCommand : IRequest<UserDto>
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}

public class LoginCommandHandler : IRequestHandler<LoginCommand, UserDto>
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IMapper _mapper;

    public LoginCommandHandler(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        IMapper mapper)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _mapper = mapper;
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
        var userDto = _mapper.Map<UserDto>(user);
        userDto.Role = roles.FirstOrDefault();

        return userDto;
    }
} 