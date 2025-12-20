using System.ComponentModel.DataAnnotations;

namespace CegCRMAPI.Core.Common.Models;

public class JwtSettings
{
    [Required]
    public string Key { get; set; } = string.Empty;

    [Required]
    public string Issuer { get; set; } = string.Empty;

    [Required]
    public string Audience { get; set; } = string.Empty;

    [Required]
    public int ExpiresInMinutes { get; set; }
} 