using Microsoft.AspNetCore.Identity;

namespace CegCRMAPI.Domain.Entities
{
    public class User : IdentityUser<Guid>
    {
        // Temel bilgiler
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime? DeletedDate { get; set; }
    }
}
