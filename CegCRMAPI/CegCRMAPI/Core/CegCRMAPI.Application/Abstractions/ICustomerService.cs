using CegCRMAPI.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Abstractions
{
    public interface ICustomerService
    {
        List<Customer> GetCustomers();
    }
}
