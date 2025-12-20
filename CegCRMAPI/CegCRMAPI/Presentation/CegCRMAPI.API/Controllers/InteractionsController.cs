using CegCRMAPI.Application.DTOs.Interaction;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Features.Commands.Interactions.CreateInteraction;
using CegCRMAPI.Application.Features.Commands.Interactions.DeleteInteraction;
using CegCRMAPI.Application.Features.Commands.Interactions.UpdateInteraction;
using CegCRMAPI.Application.Features.Queries.Interactions.GetAllInteractions;
using CegCRMAPI.Application.Features.Queries.Interactions.GetInteractionById;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CegCRMAPI.Application.DTOs.Ticket;
using CegCRMAPI.Application.Features.Queries.Ticket.GetTicketsByCustomers;
using CegCRMAPI.Application.Features.Queries.Interaction.GetInteractionsByCustomerId;

namespace CegCRMAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InteractionsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public InteractionsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<InteractionDto>>>> GetAll()
        {
            var query = new GetAllInteractionsQuery();
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("ByCustomer")]
        public async Task<ActionResult<ApiResponse<List<InteractionDto>>>> GetByCustomer(Guid customerId)
        {
            var query = new GetInteractionsByCustomerIdQuery(customerId);
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<InteractionDto>>> GetById(Guid id)
        {
            var query = new GetInteractionByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<InteractionDto>>> Create([FromBody] CreateInteractionCommand command)
        {
            var result = await _mediator.Send(command);
            return CreatedAtAction(
                nameof(GetById), 
                new { id = result.Data.Id }, 
                result
            );
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<InteractionDto>>> Update(Guid id, [FromBody] UpdateInteractionCommand command)
        {
            command = command with { Id = id };
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
        {
            var command = new DeleteInteractionCommand { Id = id };
            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
} 