using AutoMapper;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.DTOs.Customer;
using CegCRMAPI.Application.DTOs.Auth;
using CegCRMAPI.Application.DTOs.Employee;
using CegCRMAPI.Application.DTOs.Task;
using CegCRMAPI.Application.DTOs.Ticket;
using CegCRMAPI.Application.DTOs.Lead;
using CegCRMAPI.Application.Features.Commands.Customers.CreateCustomer;
using CegCRMAPI.Application.Features.Commands.Customers.UpdateCustomer;
using CegCRMAPI.Application.Features.Commands.Auth.Register;
using CegCRMAPI.Application.Features.Commands.Auth.Login;
using CegCRMAPI.Application.Features.Commands.Employees.CreateEmployee;
using CegCRMAPI.Application.Features.Commands.Tasks.CreateTask;
using CegCRMAPI.Application.Features.Commands.Tasks.UpdateTask;
using CegCRMAPI.Application.Features.Commands.Tickets.CreateTicket;
using CegCRMAPI.Application.Features.Commands.Tickets.UpdateTicket;
using CegCRMAPI.Application.Features.Commands.Leads.CreateLead;
using CegCRMAPI.Application.Features.Commands.Leads.UpdateLead;
using CegCRMAPI.Application.DTOs.Interaction;
using CegCRMAPI.Application.Features.Commands.Interactions.CreateInteraction;
using CegCRMAPI.Application.Features.Commands.Interactions.UpdateInteraction;
using CegCRMAPI.Application.Features.Commands.Interactions.DeleteInteraction;
using CegCRMAPI.Application.Features.Commands.Tasks.DeleteTask;

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
        CreateMap<Ticket, TicketDto>();
        CreateMap<CreateTicketCommand, Ticket>();
        CreateMap<UpdateTicketCommand, Ticket>();

        // Lead mappings
        CreateMap<Lead, LeadDto>();
        CreateMap<CreateLeadCommand, Lead>();
        CreateMap<UpdateLeadCommand, Lead>();

        // Interaction mappings
        CreateMap<Interaction, InteractionDto>();
        CreateMap<CreateInteractionCommand, Interaction>();
        CreateMap<UpdateInteractionCommand, Interaction>();
        CreateMap<DeleteInteractionCommand, Interaction>();
    }
} 