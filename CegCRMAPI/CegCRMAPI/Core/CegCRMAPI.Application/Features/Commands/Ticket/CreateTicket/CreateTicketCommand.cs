using AutoMapper;
using CegCRMAPI.Application.DTOs.Ticket;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using MediatR;
using CegCRMAPI.Application.Interfaces.Services;

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
    private readonly IAiService _aiService;

    public CreateTicketCommandHandler(
        ITicketRepository ticketRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IAiService aiService)
    {
        _ticketRepository = ticketRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _aiService = aiService;
    }

    public async Task<ApiResponse<TicketDto>> Handle(CreateTicketCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // AI çözüm önerisini al
            var aiSuggestion = await _aiService.GetSolutionAsync(request.Description);

            // Yeni ticket oluştur
            var ticket = new Domain.Entities.Ticket
            {
                CustomerId = request.CustomerId,
                Description = request.Description,
                AiSuggestedSolution = aiSuggestion,
                FinalSolution = aiSuggestion,
                Status = TicketStatus.ResolvedByAI,
                AssignedEmployeeId = null
            };

            await _ticketRepository.AddAsync(ticket, cancellationToken);
            await _unitOfWork.SaveChangesAsync();

            var dto = _mapper.Map<TicketDto>(ticket);
            return ApiResponse<TicketDto>.CreateSuccess(dto, "Ticket created successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<TicketDto>.CreateError($"Failed to create ticket: {ex.Message}");
        }
    }
}