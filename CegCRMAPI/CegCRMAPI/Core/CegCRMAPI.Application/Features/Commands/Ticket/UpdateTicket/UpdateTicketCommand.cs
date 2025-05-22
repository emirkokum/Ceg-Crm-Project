using AutoMapper;
using CegCRMAPI.Application.DTOs.Ticket;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Domain.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Commands.Tickets.UpdateTicket;

public record UpdateTicketCommand : IRequest<ApiResponse<TicketDto>>
{
    public Guid Id { get; init; }
    public Guid CustomerId { get; init; }
    public Guid? AssignedEmployeeId { get; init; }
    public string Status { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string? Solution { get; init; }
}

public class UpdateTicketCommandHandler : IRequestHandler<UpdateTicketCommand, ApiResponse<TicketDto>>
{
    private readonly ITicketRepository _ticketRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateTicketCommandHandler(
        ITicketRepository ticketRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _ticketRepository = ticketRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<TicketDto>> Handle(UpdateTicketCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var ticket = await _ticketRepository.GetByIdAsync(request.Id, cancellationToken);
            if (ticket == null)
            {
                return ApiResponse<TicketDto>.CreateError($"Ticket with ID {request.Id} not found");
            }

            _mapper.Map(request, ticket);
            await _unitOfWork.SaveChangesAsync();

            var ticketDto = _mapper.Map<TicketDto>(ticket);
            return ApiResponse<TicketDto>.CreateSuccess(ticketDto, "Ticket updated successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<TicketDto>.CreateError($"Failed to update ticket: {ex.Message}");
        }
    }
} 