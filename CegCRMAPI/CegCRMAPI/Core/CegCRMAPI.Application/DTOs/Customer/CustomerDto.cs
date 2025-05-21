using CegCRMAPI.Domain.Entities;

namespace CegCRMAPI.Application.DTOs.Customer;

public class CustomerDto
{
    public Guid Id { get; set; }

    public string FirstName { get; set; }
    public string LastName { get; set; }

    public string Email { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public CustomerType Type { get; set; }

}
