using CegCRMAPI.Application.DTOs;
using CegCRMAPI.Application.DTOs.Auth;

namespace CegCRMAPI.Application.DTOs.User;

public class GetUsersResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public List<UserDto> Users { get; set; } = new();
} 