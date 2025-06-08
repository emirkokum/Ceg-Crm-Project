using AutoMapper;
using CegCRMAPI.Application.DTOs.Ticket;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Queries.Tickets.GetTicketById;

public record GetTicketByIdQuery : IRequest<ApiResponse<TicketDto>>
{
    public Guid Id { get; init; }
}

public class GetTicketByIdQueryHandler : IRequestHandler<GetTicketByIdQuery, ApiResponse<TicketDto>>
{
    private readonly ITicketRepository _ticketRepository;
    private readonly IMapper _mapper;

    public GetTicketByIdQueryHandler(
        ITicketRepository ticketRepository,
        IMapper mapper)
    {
        _ticketRepository = ticketRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<TicketDto>> Handle(GetTicketByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var ticket = await _ticketRepository.GetByIdAsync(request.Id, cancellationToken);
            if (ticket == null)
            {
                return ApiResponse<TicketDto>.CreateError($"Ticket with ID {request.Id} not found");
            }

            var ticketDto = _mapper.Map<TicketDto>(ticket);
            return ApiResponse<TicketDto>.CreateSuccess(ticketDto, "Ticket retrieved successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<TicketDto>.CreateError($"Failed to retrieve ticket: {ex.Message}");
        }
    }
} 