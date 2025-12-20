using CegCRMAPI.Application.DTOs.Lead;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Features.Commands.Leads.CreateLead;
using CegCRMAPI.Application.Features.Commands.Leads.DeleteLead;
using CegCRMAPI.Application.Features.Commands.Leads.UpdateLead;
using CegCRMAPI.Application.Features.Queries.Leads.GetAllLeads;
using CegCRMAPI.Application.Features.Queries.Leads.GetLeadById;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CegCRMAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeadsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public LeadsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<LeadDto>>>> GetAll()
        {
            var query = new GetAllLeadsQuery();
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<LeadDto>>> GetById(Guid id)
        {
            var query = new GetLeadByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<LeadDto>>> Create([FromBody] CreateLeadCommand command)
        {
            var result = await _mediator.Send(command);

            if (!result.Success || result.Data == null)
                return BadRequest(result); 

            return CreatedAtAction(
                nameof(GetById),
                new { id = result.Data.Id },
                result
            );
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<LeadDto>>> Update(Guid id, [FromBody] UpdateLeadCommand command)
        {
            command = command with { Id = id };
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
        {
            var command = new DeleteLeadCommand { Id = id };
            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
} 