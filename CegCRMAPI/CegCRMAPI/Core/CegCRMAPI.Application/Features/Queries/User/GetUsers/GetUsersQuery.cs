using AutoMapper;
using CegCRMAPI.Application.DTOs.Auth;
using CegCRMAPI.Application.DTOs.User;
using CegCRMAPI.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CegCRMAPI.Application.Features.Queries.User.GetUsers;

public record GetUsersQuery : IRequest<GetUsersResponseDto>;

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, GetUsersResponseDto>
{
    private readonly UserManager<Domain.Entities.User> _userManager;
    private readonly IMapper _mapper;

    public GetUsersQueryHandler(UserManager<Domain.Entities.User> userManager, IMapper mapper)
    {
        _userManager = userManager;
        _mapper = mapper;
    }

    public async Task<GetUsersResponseDto> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await _userManager.Users.ToListAsync(cancellationToken);
        var userDtos = new List<UserDto>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var userDto = _mapper.Map<UserDto>(user);
            userDto.Role = roles.FirstOrDefault();
            userDtos.Add(userDto);
        }

        return new GetUsersResponseDto
        {
            Success = true,
            Message = "Users retrieved successfully",
            Users = userDtos
        };
    }
} 