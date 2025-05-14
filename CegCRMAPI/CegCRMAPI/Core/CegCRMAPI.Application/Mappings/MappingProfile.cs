using AutoMapper;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.DTOs.Customer;
namespace CegCRMAPI.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Customer, CustomerDto>();
        CreateMap<CustomerDto, Customer>();
    }
} 