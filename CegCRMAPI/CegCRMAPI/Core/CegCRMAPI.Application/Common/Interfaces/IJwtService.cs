namespace CegCRMAPI.Application.Common.Interfaces;

public interface IJwtService
{
    string GenerateToken(string userId, string email, IEnumerable<string> roles);
} 