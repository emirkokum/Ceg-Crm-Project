using CegCRMAPI.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Repositories
{
    public interface IEmployeeRepository : IRepository<Employee>
    {
    }
} 