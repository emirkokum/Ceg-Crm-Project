using CegCRMAPI.Application.DTOs.Task;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Features.Commands.Tasks.CreateTask;
using CegCRMAPI.Application.Features.Commands.Tasks.UpdateTask;
using CegCRMAPI.Application.Features.Queries.Tasks.GetAllTasks;
using CegCRMAPI.Application.Features.Queries.Tasks.GetTaskById;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using CegCRMAPI.Application.Features.Commands.Task.DeleteTask;

namespace CegCRMAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskItemsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TaskItemsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<TaskDto>>>> GetAll()
        {
            var query = new GetAllTasksQuery();
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<TaskDto>>> GetById(Guid id)
        {
            var query = new GetTaskByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<TaskDto>>> Create([FromBody] CreateTaskCommand command)
        {
            var result = await _mediator.Send(command);
            return CreatedAtAction(
                nameof(GetById), 
                new { id = result.Data.Id }, 
                result
            );
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<TaskDto>>> Update(Guid id, [FromBody] UpdateTaskCommand command)
        {
            command = command with { Id = id };
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
        {
            var command = new DeleteTaskCommand { Id = id };
            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
} 