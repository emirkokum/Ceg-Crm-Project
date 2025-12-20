using AutoMapper;
using CegCRMAPI.Application.DTOs.Lead;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CegCRMAPI.Application.Features.Commands.Leads.CreateLead;

public record CreateLeadCommand : IRequest<ApiResponse<LeadDto>>
{
    public string? CompanyName { get; init; }
    public string ContactName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public LeadSource Source { get; init; }
    public LeadStatus Status { get; init; }
    public IndustryType Industry { get; init; }
    public string Notes { get; init; } = string.Empty;
}

public class CreateLeadCommandHandler : IRequestHandler<CreateLeadCommand, ApiResponse<LeadDto>>
{
    private readonly INoteRepository _noteRepository;
    private readonly ILeadRepository _leadRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateLeadCommandHandler(
        ILeadRepository leadRepository,
        INoteRepository noteRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _leadRepository = leadRepository;
        _noteRepository = noteRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<LeadDto>> Handle(CreateLeadCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var newLead = _mapper.Map<Lead>(request);

            await _leadRepository.AddAsync(newLead, cancellationToken);

            if (!string.IsNullOrWhiteSpace(request.Notes))
            {
                var note = new Domain.Entities.Note
                {
                    Content = request.Notes.Trim(),
                    LeadId = newLead.Id
                };

                await _noteRepository.AddAsync(note, cancellationToken);
            }

            await _unitOfWork.SaveChangesAsync();

            var leadDto = _mapper.Map<LeadDto>(newLead);
            return ApiResponse<LeadDto>.CreateSuccess(leadDto, "Lead created successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<LeadDto>.CreateError("Failed to create lead", ex.Message);
        }
    }
}
