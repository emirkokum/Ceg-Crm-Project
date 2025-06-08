using AutoMapper;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.DTOs.Customer;
using CegCRMAPI.Application.DTOs.Auth;
using CegCRMAPI.Application.DTOs.Employee;
using CegCRMAPI.Application.DTOs.Task;
using CegCRMAPI.Application.DTOs.Ticket;
using CegCRMAPI.Application.DTOs.Lead;
using CegCRMAPI.Application.DTOs.Sale;
using CegCRMAPI.Application.DTOs.Product;
using CegCRMAPI.Application.Features.Commands.Customers.CreateCustomer;
using CegCRMAPI.Application.Features.Commands.Customers.UpdateCustomer;
using CegCRMAPI.Application.Features.Commands.Auth.Register;
using CegCRMAPI.Application.Features.Commands.Employees.CreateEmployee;
using CegCRMAPI.Application.Features.Commands.Tasks.CreateTask;
using CegCRMAPI.Application.Features.Commands.Tasks.UpdateTask;
using CegCRMAPI.Application.Features.Commands.Tickets.CreateTicket;
using CegCRMAPI.Application.Features.Commands.Tickets.UpdateTicket;
using CegCRMAPI.Application.Features.Commands.Leads.CreateLead;
using CegCRMAPI.Application.Features.Commands.Leads.UpdateLead;
using CegCRMAPI.Application.Features.Commands.Sales.CreateSale;
using CegCRMAPI.Application.Features.Commands.Sales.UpdateSale;
using CegCRMAPI.Application.Features.Commands.Products.CreateProduct;
using CegCRMAPI.Application.Features.Commands.Products.UpdateProduct;
using CegCRMAPI.Application.DTOs.Interaction;
using CegCRMAPI.Application.Features.Commands.Interactions.CreateInteraction;
using CegCRMAPI.Application.Features.Commands.Interactions.UpdateInteraction;
using CegCRMAPI.Application.Features.Commands.Interactions.DeleteInteraction;
using CegCRMAPI.Application.Features.Commands.Task.DeleteTask;

namespace CegCRMAPI.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Customer mappings
        CreateMap<Customer, CustomerDto>();
        CreateMap<CustomerDto, Customer>();
        CreateMap<CreateCustomerCommand, Customer>();
        CreateMap<UpdateCustomerCommand, Customer>();

        // User mappings
        CreateMap<User, UserDto>();
        CreateMap<RegisterCommand, User>();

        // Employee mappings
        CreateMap<Employee, EmployeeDto>();
        CreateMap<EmployeeDto, Employee>();
        CreateMap<CreateEmployeeCommand, Employee>();

        // Task mappings
        CreateMap<TaskItem, TaskDto>();
        CreateMap<CreateTaskCommand, TaskItem>();
        CreateMap<UpdateTaskCommand, TaskItem>();
        CreateMap<DeleteTaskCommand, TaskItem>();

        // Ticket mappings
        CreateMap<Ticket, TicketDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
        CreateMap<CreateTicketCommand, Ticket>();
        CreateMap<UpdateTicketCommand, Ticket>();

        // Lead mappings
        CreateMap<Lead, LeadDto>();
        CreateMap<CreateLeadCommand, Lead>();
        CreateMap<UpdateLeadCommand, Lead>();

        // Sale mappings
        CreateMap<Sale, SaleDto>();
        CreateMap<CreateSaleCommand, Sale>();
        CreateMap<UpdateSaleCommand, Sale>();
        CreateMap<SaleProduct, SaleProductDto>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name));

        // Product mappings
        CreateMap<Product, ProductDto>();
        CreateMap<CreateProductCommand, Product>();
        CreateMap<UpdateProductCommand, Product>();

        // Interaction mappings
        CreateMap<Interaction, InteractionDto>()
            .ForMember(dest => dest.CustomerFullName, opt =>
            opt.MapFrom(src => $"{src.Customer.FirstName} {src.Customer.LastName}"));

        CreateMap<CreateInteractionCommand, Interaction>();
        CreateMap<UpdateInteractionCommand, Interaction>();
        CreateMap<DeleteInteractionCommand, Interaction>();
    }
} 