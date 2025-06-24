using CegCRMAPI.Application.DTOs.Ticket;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Features.Commands.Tickets.CreateTicket;
using CegCRMAPI.Application.Features.Commands.Tickets.UpdateTicket;
using CegCRMAPI.Application.Features.Queries.Tickets.GetAllTickets;
using CegCRMAPI.Application.Features.Queries.Tickets.GetTicketById;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CegCRMAPI.Application.Features.Commands.Ticket.DeleteTicket;
using CegCRMAPI.Application.Features.Commands.Tickets.AssignTicketToEmployee;
using CegCRMAPI.Application.Features.Commands.Ticket;
using CegCRMAPI.Application.Features.Commands.Tickets.ChangeTicketStatus;
using CegCRMAPI.Application.Features.Queries.Ticket.GetTicketsByCustomers;
using CegCRMAPI.Application.Features.Commands.Ticket.AssignTicketToRandomEmployee;
using Microsoft.AspNetCore.Authorization;

namespace CegCRMAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TicketsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<TicketDto>>>> GetAll()
        {
            var query = new GetAllTicketsQuery();
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("ByCustomer")]
        public async Task<ActionResult<ApiResponse<List<TicketDto>>>> GetByCustomer(Guid customerId)
        {
            var query = new GetTicketsByCustomerIdQuery(customerId);
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<TicketDto>>> GetById(Guid id)
        {
            var query = new GetTicketByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<TicketDto>>> Create([FromBody] CreateTicketCommand command)
        {
            var result = await _mediator.Send(command);
            return CreatedAtAction(
                nameof(GetById), 
                new { id = result.Data.Id }, 
                result
            );
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<TicketDto>>> Update(Guid id, [FromBody] UpdateTicketCommand command)
        {
            command = command with { Id = id };
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
        {
            var command = new DeleteTicketCommand { Id = id };
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        
        [HttpPut("{id}/assign")]
        public async Task<IActionResult> AssignToEmployee(Guid id, [FromBody] AssignTicketToEmployeeCommand request)
        {
            if (id != request.TicketId)
                return BadRequest("Ticket ID mismatch.");

            var command = new AssignTicketToEmployeeCommand(request.TicketId, request.EmployeeId);
            var result = await _mediator.Send(command);

            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result);
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> ChangeStatus(Guid id, [FromBody] ChangeTicketStatusCommand request)
        {
            if (id != request.TicketId)
                return BadRequest("Ticket ID mismatch");

            var command = new ChangeTicketStatusCommand(request.TicketId, request.NewStatus);
            var result = await _mediator.Send(command);

            if (!result.Success)
                return NotFound(result.Message);

            return Ok(result);
        }

        [HttpPost("{ticketId}/assign-random-employee")]
        public async Task<IActionResult> AssignRandomEmployee(Guid ticketId)
        {
            var result = await _mediator.Send(new AssignTicketToRandomEmployeeCommand(ticketId));
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }
    }
} 