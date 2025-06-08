using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Commands.Ticket.DeleteTicket;

public record DeleteTicketCommand : IRequest<ApiResponse<bool>>
{
    public Guid Id { get; init; }
}

public class DeleteTicketCommandHandler : IRequestHandler<DeleteTicketCommand, ApiResponse<bool>>
{
    private readonly ITicketRepository _ticketRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteTicketCommandHandler(
        ITicketRepository ticketRepository,
        IUnitOfWork unitOfWork)
    {
        _ticketRepository = ticketRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<bool>> Handle(DeleteTicketCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var ticket = await _ticketRepository.GetByIdAsync(request.Id, cancellationToken);
            if (ticket == null)
            {
                return ApiResponse<bool>.CreateError($"Ticket with ID {request.Id} not found");
            }

            _ticketRepository.Remove(ticket);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.CreateSuccess(true, "Ticket deleted successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<bool>.CreateError($"Failed to delete ticket: {ex.Message}");
        }
    }
} 