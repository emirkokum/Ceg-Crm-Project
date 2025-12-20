using Microsoft.AspNetCore.Http;

namespace CegCRMAPI.Application.Exceptions;

public class NotFoundException : BaseException
{
    public NotFoundException(string name, object key)
        : base($"Entity \"{name}\" ({key}) was not found.", StatusCodes.Status404NotFound)
    {
    }
} 