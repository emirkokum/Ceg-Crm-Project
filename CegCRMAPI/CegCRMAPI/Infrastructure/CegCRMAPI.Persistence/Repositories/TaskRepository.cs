using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using CegCRMAPI.Persistence.Context;
using CegCRMAPI.Persistence.Repositories;

namespace CegCRMAPI.Persistence.Repositories
{
    public class TaskRepository : Repository<TaskItem>, ITaskRepository
    {
        public TaskRepository(CegCrmDbContext context) : base(context)
        {
        }
    }
} 