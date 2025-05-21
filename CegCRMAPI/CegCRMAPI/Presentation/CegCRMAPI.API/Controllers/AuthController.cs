using CegCRMAPI.Application.DTOs.Auth;
using CegCRMAPI.Application.DTOs.User;
using CegCRMAPI.Application.Features.Commands.Auth.Login;
using CegCRMAPI.Application.Features.Commands.Auth.Register;
using CegCRMAPI.Application.Features.Queries.User.GetUsers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] CegCRMAPI.Application.Features.Commands.Auth.Register.RegisterCommand command)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _mediator.Send(command);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] CegCRMAPI.Application.Features.Commands.Auth.Login.LoginCommand command)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _mediator.Send(command);
            
            if (!result.Success)
                return Unauthorized(result);

            return Ok(result);
        }

        [HttpGet("users")]
        public async Task<ActionResult<GetUsersResponseDto>> GetUsers()
        {
            var result = await _mediator.Send(new GetUsersQuery());
            return Ok(result);
        }
    }
} 