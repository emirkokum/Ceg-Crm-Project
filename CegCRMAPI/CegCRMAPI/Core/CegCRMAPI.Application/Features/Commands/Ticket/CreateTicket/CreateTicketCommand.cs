using AutoMapper;
using CegCRMAPI.Application.DTOs.Ticket;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Domain.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Commands.Tickets.CreateTicket;

public record CreateTicketCommand : IRequest<ApiResponse<TicketDto>>
{
    public Guid CustomerId { get; init; }
    public Guid? AssignedEmployeeId { get; init; }
    public string Status { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string? Solution { get; init; }
}

public class CreateTicketCommandHandler : IRequestHandler<CreateTicketCommand, ApiResponse<TicketDto>>
{
    private readonly ITicketRepository _ticketRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateTicketCommandHandler(
        ITicketRepository ticketRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _ticketRepository = ticketRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<TicketDto>> Handle(CreateTicketCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var ticket = _mapper.Map<Ticket>(request);

            await _ticketRepository.AddAsync(ticket, cancellationToken);
            await _unitOfWork.SaveChangesAsync();

            var ticketDto = _mapper.Map<TicketDto>(ticket);
            return ApiResponse<TicketDto>.CreateSuccess(ticketDto, "Ticket created successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<TicketDto>.CreateError($"Failed to create ticket: {ex.Message}");
        }
    }
} 