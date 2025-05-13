using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Domain.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CegCRMAPI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InteractionController : ControllerBase
    {
        private readonly IInteractionRepository _interactionRepository;

        public InteractionController(IInteractionRepository interactionRepository)
        {
            _interactionRepository = interactionRepository;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Interaction>> GetById(Guid id)
        {
            var interaction = await _interactionRepository.GetByIdAsync(id);
            if (interaction == null)
                return NotFound();

            return Ok(interaction);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Interaction>>> GetAllInteractions()
        {
            var interactions = await _interactionRepository.GetAllInteractionsAsync();
            return Ok(interactions);
        }

        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<Interaction>>> GetInteractionsByCustomer(Guid customerId)
        {
            var interactions = await _interactionRepository.GetInteractionsByCustomerIdAsync(customerId);
            return Ok(interactions);
        }

        [HttpPost]
        public async Task<ActionResult<Interaction>> Create(Interaction interaction)
        {
            var createdInteraction = await _interactionRepository.CreateAsync(interaction);
            return CreatedAtAction(nameof(GetById), new { id = createdInteraction.Id }, createdInteraction);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, Interaction interaction)
        {
            if (id != interaction.Id)
                return BadRequest();

            var updatedInteraction = await _interactionRepository.UpdateAsync(interaction);
            return Ok(updatedInteraction);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _interactionRepository.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
} 