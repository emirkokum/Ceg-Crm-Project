using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CegCRMAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        public IActionResult GetCustomers()
        {
            return Ok();
        }        
    }
}
