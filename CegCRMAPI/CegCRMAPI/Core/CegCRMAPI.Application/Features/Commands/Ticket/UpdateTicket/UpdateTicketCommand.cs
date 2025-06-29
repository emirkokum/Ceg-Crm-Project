using AutoMapper;
using CegCRMAPI.Application.DTOs.Ticket;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;
using CegCRMAPI.Domain.Entities;

namespace CegCRMAPI.Application.Features.Commands.Tickets.UpdateTicket;

public record UpdateTicketCommand : IRequest<ApiResponse<TicketDto>>
{
    public Guid Id { get; init; }
    public TicketStatus? Status { get; init; }
    public string? FinalSolution { get; init; }
    public Guid? AssignedEmployeeId { get; init; }
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
            if (ticket is null)
            {
                return ApiResponse<TicketDto>.CreateError($"Ticket with ID {request.Id} not found");
            }

            if (request.Status.HasValue)
            ticket.Status = request.Status.Value;

            if (!string.IsNullOrWhiteSpace(request.FinalSolution))
                ticket.FinalSolution = request.FinalSolution;

            if (request.AssignedEmployeeId.HasValue)
                ticket.AssignedEmployeeId = request.AssignedEmployeeId;

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