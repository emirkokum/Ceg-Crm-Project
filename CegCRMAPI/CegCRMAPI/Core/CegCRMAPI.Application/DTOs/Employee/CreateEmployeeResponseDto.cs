namespace CegCRMAPI.Application.DTOs.Employee
{
    public class CreateEmployeeResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public EmployeeDto Employee { get; set; }
    }
} 