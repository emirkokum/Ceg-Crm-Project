using AutoMapper;
using CegCRMAPI.Application.DTOs.Ticket;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using CegCRMAPI.Domain.Entities;
using MediatR;

namespace CegCRMAPI.Application.Features.Commands.Tickets.ChangeTicketStatus;

public record ChangeTicketStatusCommand(Guid TicketId, TicketStatus NewStatus)
    : IRequest<ApiResponse<TicketDto>>;

public class ChangeTicketStatusCommandHandler
    : IRequestHandler<ChangeTicketStatusCommand, ApiResponse<TicketDto>>
{
    private readonly ITicketRepository _ticketRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ChangeTicketStatusCommandHandler(
        ITicketRepository ticketRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _ticketRepository = ticketRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<TicketDto>> Handle(ChangeTicketStatusCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var ticket = await _ticketRepository.GetByIdAsync(request.TicketId, cancellationToken);
            if (ticket is null)
                return ApiResponse<TicketDto>.CreateError($"Ticket with ID {request.TicketId} not found");

            ticket.Status = request.NewStatus;

            await _unitOfWork.SaveChangesAsync();

            var ticketDto = _mapper.Map<TicketDto>(ticket);
            return ApiResponse<TicketDto>.CreateSuccess(ticketDto, "Ticket status updated successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<TicketDto>.CreateError($"Failed to update ticket status: {ex.Message}");
        }
    }
}
