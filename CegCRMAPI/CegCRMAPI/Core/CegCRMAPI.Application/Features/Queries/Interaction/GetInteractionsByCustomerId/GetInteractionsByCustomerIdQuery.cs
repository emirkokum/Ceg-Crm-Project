using AutoMapper;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.DTOs.Interaction;
using CegCRMAPI.Application.Features.Queries.Interaction.GetInteractionsByCustomerId;
using CegCRMAPI.Application.Repositories;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Features.Queries.Interaction.GetInteractionsByCustomerId
{
    public record GetInteractionsByCustomerIdQuery(Guid CustomerId) : IRequest<ApiResponse<List<InteractionDto>>>;

    public class GetInteractionsByCustomerIdQueryHandler : IRequestHandler<GetInteractionsByCustomerIdQuery, ApiResponse<List<InteractionDto>>>
    {
        private readonly IInteractionRepository _interactionRepository;
        private readonly IMapper _mapper;

        public GetInteractionsByCustomerIdQueryHandler(IInteractionRepository interactionRepository, IMapper mapper)
        {
            _interactionRepository = interactionRepository;
            _mapper = mapper;
        }

        public async Task<ApiResponse<List<InteractionDto>>> Handle(GetInteractionsByCustomerIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var interactions = await _interactionRepository.GetByCustomerIdAsync(request.CustomerId, cancellationToken);

                var interactionDto = _mapper.Map<List<InteractionDto>>(interactions);
                return ApiResponse<List<InteractionDto>>.CreateSuccess(interactionDto, "Interactions retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<List<InteractionDto>>.CreateError($"Failed to retrieve interactions: {ex.Message}");
            }
        }
    }
}
