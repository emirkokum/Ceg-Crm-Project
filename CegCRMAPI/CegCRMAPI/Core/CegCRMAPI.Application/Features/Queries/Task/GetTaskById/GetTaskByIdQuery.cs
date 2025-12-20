using AutoMapper;
using CegCRMAPI.Application.DTOs.Task;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Queries.Tasks.GetTaskById;

public record GetTaskByIdQuery : IRequest<ApiResponse<TaskDto>>
{
    public Guid Id { get; init; }
}

public class GetTaskByIdQueryHandler : IRequestHandler<GetTaskByIdQuery, ApiResponse<TaskDto>>
{
    private readonly ITaskRepository _taskRepository;
    private readonly IMapper _mapper;

    public GetTaskByIdQueryHandler(
        ITaskRepository taskRepository,
        IMapper mapper)
    {
        _taskRepository = taskRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<TaskDto>> Handle(GetTaskByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var task = await _taskRepository.GetByIdAsync(request.Id, cancellationToken);
            if (task == null)
            {
                return ApiResponse<TaskDto>.CreateError($"Task with ID {request.Id} not found");
            }

            var taskDto = _mapper.Map<TaskDto>(task);
            return ApiResponse<TaskDto>.CreateSuccess(taskDto, "Task retrieved successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<TaskDto>.CreateError($"Failed to retrieve task: {ex.Message}");
        }
    }
} 