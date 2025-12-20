
using AutoMapper;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.DTOs.Ticket;
using CegCRMAPI.Application.Repositories;
using CegCRMAPI.Domain.Entities;
using MediatR;

namespace CegCRMAPI.Application.Features.Commands.Tickets.AssignTicketToEmployee
{
    public record AssignTicketToEmployeeCommand(Guid TicketId, Guid EmployeeId) : IRequest<ApiResponse<TicketDto>>;

    public class AssignTicketToEmployeeCommandHandler : IRequestHandler<AssignTicketToEmployeeCommand, ApiResponse<TicketDto>>
    {
        private readonly ITicketRepository _ticketRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AssignTicketToEmployeeCommandHandler(
            ITicketRepository ticketRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _ticketRepository = ticketRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ApiResponse<TicketDto>> Handle(AssignTicketToEmployeeCommand request, CancellationToken cancellationToken)
        {
            var ticket = await _ticketRepository.GetByIdAsync(request.TicketId);
            if (ticket == null)
                return ApiResponse<TicketDto>.CreateError("Ticket not found.");

            ticket.AssignedEmployeeId = request.EmployeeId;
            ticket.Status = TicketStatus.AssignedToEmployee;

            _ticketRepository.Update(ticket);
            await _unitOfWork.SaveChangesAsync();

            var dto = _mapper.Map<TicketDto>(ticket);
            return ApiResponse<TicketDto>.CreateSuccess(dto, "Ticket assigned to employee.");
        }
    }


}