using Microsoft.AspNetCore.Http;

namespace CegCRMAPI.Application.Exceptions;

public class ValidationException : BaseException
{
    public IDictionary<string, string[]> Errors { get; }

    public ValidationException(IDictionary<string, string[]> errors)
        : base("One or more validation errors occurred.", StatusCodes.Status400BadRequest, errors)
    {
        Errors = errors;
    }
} 