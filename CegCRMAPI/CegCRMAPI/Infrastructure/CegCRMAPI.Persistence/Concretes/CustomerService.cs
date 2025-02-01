using CegCRMAPI.Application.Abstractions;
using CegCRMAPI.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CegCRMAPI.Persistence.Concretes
{
    public class CustomerService : ICustomerService
    {
        public List<Customer> GetCustomers()
        {
            throw new NotImplementedException();
        }
    }
}
