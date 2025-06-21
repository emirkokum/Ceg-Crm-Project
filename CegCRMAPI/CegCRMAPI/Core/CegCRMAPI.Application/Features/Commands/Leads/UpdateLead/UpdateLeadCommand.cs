using AutoMapper;
using CegCRMAPI.Application.DTOs.Lead;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Commands.Leads.UpdateLead;

public record UpdateLeadCommand : IRequest<ApiResponse<LeadDto>>
{
    public Guid Id { get; init; }
    public string? CompanyName { get; init; }
    public string ContactName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public LeadSource Source { get; init; }
    public LeadStatus Status { get; init; }
    public IndustryType Industry { get; init; }
    public string Notes { get; init; } = string.Empty;
}

public class UpdateLeadCommandHandler : IRequestHandler<UpdateLeadCommand, ApiResponse<LeadDto>>
{
    private readonly ILeadRepository _leadRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateLeadCommandHandler(
        ILeadRepository leadRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _leadRepository = leadRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<LeadDto>> Handle(UpdateLeadCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var lead = await _leadRepository.GetByIdAsync(request.Id, cancellationToken);
            if (lead == null)
            {
                return ApiResponse<LeadDto>.CreateError($"Lead with ID {request.Id} not found");
            }

            _mapper.Map(request, lead);
            await _unitOfWork.SaveChangesAsync();

            var leadDto = _mapper.Map<LeadDto>(lead);
            return ApiResponse<LeadDto>.CreateSuccess(leadDto, "Lead updated successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<LeadDto>.CreateError($"Failed to update lead: {ex.Message}");
        }
    }
} 