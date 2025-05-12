using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Domain.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace CegCRMAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public CustomerController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var customers = await _unitOfWork.CustomerRepository.GetAllAsync();
            return Ok(customers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var customer = await _unitOfWork.CustomerRepository.GetByIdAsync(id);
            if (customer == null)
                return NotFound();

            return Ok(customer);
        }

        [HttpGet("segment/{segment}")]
        public async Task<IActionResult> GetBySegment(string segment)
        {
            var customers = await _unitOfWork.CustomerRepository.GetCustomersBySegmentAsync(segment);
            return Ok(customers);
        }

        [HttpGet("with-interactions")]
        public async Task<IActionResult> GetWithInteractions()
        {
            var customers = await _unitOfWork.CustomerRepository.GetCustomersWithInteractionsAsync();
            return Ok(customers);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Customer customer)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();
                await _unitOfWork.CustomerRepository.AddAsync(customer);
                await _unitOfWork.SaveChangesAsync();
                await _unitOfWork.CommitTransactionAsync();

                return CreatedAtAction(nameof(GetById), new { id = customer.Id }, customer);
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Customer customer)
        {
            if (id != customer.Id)
                return BadRequest();

            var existingCustomer = await _unitOfWork.CustomerRepository.GetByIdAsync(id);
            if (existingCustomer == null)
                return NotFound();

            try
            {
                await _unitOfWork.BeginTransactionAsync();
                _unitOfWork.CustomerRepository.Update(customer);
                await _unitOfWork.SaveChangesAsync();
                await _unitOfWork.CommitTransactionAsync();

                return NoContent();
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var customer = await _unitOfWork.CustomerRepository.GetByIdAsync(id);
            if (customer == null)
                return NotFound();

            try
            {
                await _unitOfWork.BeginTransactionAsync();
                _unitOfWork.CustomerRepository.Remove(customer);
                await _unitOfWork.SaveChangesAsync();
                await _unitOfWork.CommitTransactionAsync();

                return NoContent();
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }
    }
}
