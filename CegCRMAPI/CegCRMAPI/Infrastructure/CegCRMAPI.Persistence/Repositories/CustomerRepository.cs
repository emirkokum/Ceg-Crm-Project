using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CegCRMAPI.Persistence.Context;
using CegCRMAPI.Persistence.Repositories;
namespace CegCRMAPI.Infrastructure.Repositories
{
    public class CustomerRepository : Repository<Customer>, ICustomerRepository
    {
        public CustomerRepository(CegCrmDbContext context) : base(context)
        {
        }
    }
} 