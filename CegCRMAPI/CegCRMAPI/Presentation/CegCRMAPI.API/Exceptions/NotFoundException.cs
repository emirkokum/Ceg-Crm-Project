using Microsoft.AspNetCore.Http;

namespace CegCRMAPI.API.Exceptions;

public class NotFoundException : BaseException
{
    public NotFoundException(string name, object key)
        : base($"Entity \"{name}\" ({key}) was not found.", StatusCodes.Status404NotFound)
    {
    }
} 