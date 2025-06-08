using AutoMapper;
using CegCRMAPI.Application.DTOs.Ticket;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Features.Queries.Tickets.GetAllTickets;

public record GetAllTicketsQuery : IRequest<ApiResponse<List<TicketDto>>>
{
}

public class GetAllTicketsQueryHandler : IRequestHandler<GetAllTicketsQuery, ApiResponse<List<TicketDto>>>
{
    private readonly ITicketRepository _ticketRepository;
    private readonly IMapper _mapper;

    public GetAllTicketsQueryHandler(
        ITicketRepository ticketRepository,
        IMapper mapper)
    {
        _ticketRepository = ticketRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<TicketDto>>> Handle(GetAllTicketsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var tickets = await _ticketRepository.GetAllAsync(cancellationToken);
            var ticketDtos = _mapper.Map<List<TicketDto>>(tickets);
            
            return ApiResponse<List<TicketDto>>.CreateSuccess(
                ticketDtos, 
                "Tickets retrieved successfully"
            );
        }
        catch (Exception ex)
        {
            return ApiResponse<List<TicketDto>>.CreateError($"Failed to retrieve tickets: {ex.Message}");
        }
    }
} 