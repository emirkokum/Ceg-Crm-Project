namespace CegCRMAPI.Application.DTOs.Common;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public string? ErrorDetails { get; set; } 

    public static ApiResponse<T> CreateSuccess(T data, string message = "Operation completed successfully")
    {
        return new ApiResponse<T>
        {
            Success = true,
            Message = message,
            Data = data
        };
    }

    public static ApiResponse<T> CreateError(string message)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message,
            Data = default
        };
    }

    public static ApiResponse<T> CreateError(string message, string? errorDetails)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message,
            ErrorDetails = errorDetails,
            Data = default
        };
    }


    public static ApiResponse<T> CreateEmpty(string message = "No content")
    {
        return new ApiResponse<T>
        {
            Success = true,
            Message = message,
            Data = default
        };
    }
}
