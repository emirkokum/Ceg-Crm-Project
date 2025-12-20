using System.Net;
using System.Text.Json;
using CegCRMAPI.Application.Exceptions;
using Microsoft.AspNetCore.Http;

namespace CegCRMAPI.API.Middleware;

public class GlobalExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;

    public GlobalExceptionHandlingMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception has occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        var response = new
        {
            StatusCode = GetStatusCode(exception),
            Message = GetMessage(exception),
            Details = GetDetails(exception)
        };

        context.Response.StatusCode = response.StatusCode;
        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }

    private static int GetStatusCode(Exception exception) => exception switch
    {
        BaseException baseException => baseException.StatusCode,
        UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
        _ => StatusCodes.Status500InternalServerError
    };

    private static string GetMessage(Exception exception) => exception switch
    {
        BaseException baseException => baseException.Message,
        UnauthorizedAccessException => "You are not authorized to perform this action",
        _ => "An unexpected error occurred"
    };

    private static object? GetDetails(Exception exception) => exception switch
    {
        BaseException baseException => baseException.Details,
        _ => null
    };
} 