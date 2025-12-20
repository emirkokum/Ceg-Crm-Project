using AutoMapper;
using CegCRMAPI.Application.DTOs.Task;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Features.Queries.Tasks.GetAllTasks;

public record GetAllTasksQuery : IRequest<ApiResponse<List<TaskDto>>>
{
}

public class GetAllTasksQueryHandler : IRequestHandler<GetAllTasksQuery, ApiResponse<List<TaskDto>>>
{
    private readonly ITaskRepository _taskRepository;
    private readonly IMapper _mapper;

    public GetAllTasksQueryHandler(
        ITaskRepository taskRepository,
        IMapper mapper)
    {
        _taskRepository = taskRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<TaskDto>>> Handle(GetAllTasksQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var tasks = await _taskRepository.GetAllAsync(cancellationToken);
            var taskDtos = _mapper.Map<List<TaskDto>>(tasks);
            
            return ApiResponse<List<TaskDto>>.CreateSuccess(
                taskDtos, 
                "Tasks retrieved successfully"
            );
        }
        catch (Exception ex)
        {
            return ApiResponse<List<TaskDto>>.CreateError($"Failed to retrieve tasks: {ex.Message}");
        }
    }
} 