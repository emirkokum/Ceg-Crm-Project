using AutoMapper;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.DTOs.Ticket;
using CegCRMAPI.Application.Repositories;
using CegCRMAPI.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Features.Commands.Ticket.AssignTicketToRandomEmployee
{
    public record AssignTicketToRandomEmployeeCommand(Guid TicketId) : IRequest<ApiResponse<TicketDto>>;
    public class AssignTicketToRandomEmployeeCommandHandler : IRequestHandler<AssignTicketToRandomEmployeeCommand, ApiResponse<TicketDto>>
    {
        private readonly ITicketRepository _ticketRepository;
        private readonly UserManager<Domain.Entities.User> _userManager;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IEmployeeRepository _employeeRepository;

        public AssignTicketToRandomEmployeeCommandHandler(
            ITicketRepository ticketRepository,
            UserManager<Domain.Entities.User> userManager,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IEmployeeRepository employeeRepository)
        {
            _ticketRepository = ticketRepository;
            _userManager = userManager;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _employeeRepository = employeeRepository;
        }

        public async Task<ApiResponse<TicketDto>> Handle(AssignTicketToRandomEmployeeCommand request, CancellationToken cancellationToken)
        {
            var ticket = await _ticketRepository.GetByIdAsync(request.TicketId, cancellationToken);
            if (ticket == null)
                return ApiResponse<TicketDto>.CreateError("Ticket not found");

            if (ticket.AssignedEmployeeId != null)
                return ApiResponse<TicketDto>.CreateError("Ticket is already assigned");

            var supportUsers = await _userManager.GetUsersInRoleAsync("Support");
            if (supportUsers == null || !supportUsers.Any())
                return ApiResponse<TicketDto>.CreateError("No support employees found");

            var random = new Random();
            var selectedSupport = supportUsers[random.Next(supportUsers.Count)];

            var employee = await _employeeRepository.FirstOrDefaultAsync
                (e => e.UserId == selectedSupport.Id);

            if (employee == null)
                return ApiResponse<TicketDto>.CreateError("No matching employee found for selected support user");

            ticket.AssignedEmployeeId = employee.Id;
            ticket.Status = TicketStatus.AssignedToEmployee;

            _ticketRepository.Update(ticket);
            await _unitOfWork.SaveChangesAsync();

            var dto = _mapper.Map<TicketDto>(ticket);
            return ApiResponse<TicketDto>.CreateSuccess(dto, "Ticket assigned to a support employee");
        }
    }
}
