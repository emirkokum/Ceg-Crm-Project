using Microsoft.AspNetCore.Http;

namespace CegCRMAPI.Application.Exceptions;

public abstract class BaseException : Exception
{
    public int StatusCode { get; }
    public object? Details { get; }

    protected BaseException(string message, int statusCode, object? details = null) 
        : base(message)
    {
        StatusCode = statusCode;
        Details = details;
    }
} 