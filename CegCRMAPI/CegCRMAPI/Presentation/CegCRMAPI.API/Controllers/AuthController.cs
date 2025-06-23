using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CegCRMAPI.Application.Features.Commands.Auth.Login;
using CegCRMAPI.Application.Features.Commands.Auth.Register;
using CegCRMAPI.Application.Features.Queries.Auth.GetRoles;
using CegCRMAPI.Application.Features.Commands.Auth.Role;
using CegCRMAPI.Application.DTOs.Auth;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.DTOs.User;
using CegCRMAPI.Application.Features.Queries.User.GetUsers;
using CegCRMAPI.Application.Features.Commands.User.UpdateUser;
using CegCRMAPI.Application.Features.Commands.User.DeleteUser;
using CegCRMAPI.Application.Features.Commands.User.ResetUserPassword;

namespace CegCRMAPI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(new { Success = result });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(new { Data = result });
        }

        [HttpGet("roles")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _mediator.Send(new GetRolesQuery());
            return Ok(new { Data = roles });
        }

        [HttpPost("roles")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateRole([FromBody] CreateRoleCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(new { Success = result });
        }

        [HttpDelete("roles/{name}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteRole(string name)
        {
            var result = await _mediator.Send(new DeleteRoleCommand { Name = name });
            return Ok(new { Success = result });
        }

        [HttpGet("users")]
        public async Task<ActionResult<ApiResponse<List<UserDto>>>> GetUsers()
        {
            var result = await _mediator.Send(new GetUsersQuery());
            return Ok(ApiResponse<List<UserDto>>.CreateSuccess(result.Users, result.Message));
        }

        [HttpPut("users/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<UserDto>>> UpdateUser(Guid id, [FromBody] UpdateUserCommand command)
        {
            command = command with { Id = id };
            var result = await _mediator.Send(command);
            return Ok(ApiResponse<UserDto>.CreateSuccess(result, "User updated successfully"));
        }

        [HttpDelete("users/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteUser(Guid id)
        {
            var result = await _mediator.Send(new DeleteUserCommand { Id = id });
            return Ok(ApiResponse<bool>.CreateSuccess(result, "User deleted successfully"));
        }

        [HttpPost("admin-reset-password")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminResetPassword([FromBody] AdminResetUserPasswordCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(new { Success = result });
        }
    }
} 