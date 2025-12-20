using AutoMapper;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.DTOs.Ticket;
using CegCRMAPI.Application.Features.Queries.Tickets.GetTicketById;
using CegCRMAPI.Application.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Features.Queries.Ticket.GetTicketsByCustomers
{
    public class GetTicketsByCustomerIdQuery : IRequest<ApiResponse<List<TicketDto>>> 
    {
        public Guid CustomerId { get; init; }
        public GetTicketsByCustomerIdQuery(Guid customerId)
        {
            CustomerId = customerId;
        }

        public class GetTicketsByCustomerIdQueryHandler : IRequestHandler<GetTicketsByCustomerIdQuery, ApiResponse<List<TicketDto>>>
        {
            private readonly ITicketRepository _ticketRepository;
            private readonly IMapper _mapper;

            public GetTicketsByCustomerIdQueryHandler(
                ITicketRepository ticketRepository,
                IMapper mapper)
            {
                _ticketRepository = ticketRepository;
                _mapper = mapper;
            }

            public async Task<ApiResponse<List<TicketDto>>> Handle(GetTicketsByCustomerIdQuery request, CancellationToken cancellationToken)
            {
                try
                {
                    var tickets = await _ticketRepository.GetByCustomerIdAsync(request.CustomerId, cancellationToken);

                    if (tickets is null || tickets.Count == 0)
                        return ApiResponse<List<TicketDto>>.CreateSuccess(new List<TicketDto>(), "No ticket found.");

                    var ticketDto = _mapper.Map<List<TicketDto>>(tickets);
                    return ApiResponse<List<TicketDto>>.CreateSuccess(ticketDto, "Ticket retrieved successfully");
                }
                catch (Exception ex)
                {
                    return ApiResponse<List<TicketDto>>.CreateError($"Failed to retrieve ticket: {ex.Message}");
                }
            }
        }
    }
}
