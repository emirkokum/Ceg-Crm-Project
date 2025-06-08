using AutoMapper;
using CegCRMAPI.Application.DTOs.Lead;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Commands.Leads.CreateLead;

public record CreateLeadCommand : IRequest<ApiResponse<LeadDto>>
{
    public string? CompanyName { get; init; }
    public string ContactName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public string Source { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public string Industry { get; init; } = string.Empty;
    public string Notes { get; init; } = string.Empty;
}

public class CreateLeadCommandHandler : IRequestHandler<CreateLeadCommand, ApiResponse<LeadDto>>
{
    private readonly ILeadRepository _leadRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateLeadCommandHandler(
        ILeadRepository leadRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _leadRepository = leadRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<LeadDto>> Handle(CreateLeadCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var lead = _mapper.Map<Lead>(request);

            await _leadRepository.AddAsync(lead, cancellationToken);
            await _unitOfWork.SaveChangesAsync();

            var leadDto = _mapper.Map<LeadDto>(lead);
            return ApiResponse<LeadDto>.CreateSuccess(leadDto, "Lead created successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<LeadDto>.CreateError($"Failed to create lead: {ex.Message}");
        }
    }
} 