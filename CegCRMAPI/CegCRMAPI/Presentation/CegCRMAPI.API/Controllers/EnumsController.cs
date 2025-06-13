using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.DTOs.Enum;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Infrastructure.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using static CegCRMAPI.Domain.Entities.Interaction;
using static CegCRMAPI.Domain.Entities.Lead;
using static CegCRMAPI.Domain.Entities.Sale;

[Route("api/[controller]")]
[ApiController]
public class EnumsController : ControllerBase
{
    private readonly IMemoryCache _cache;

    public EnumsController(IMemoryCache cache)
    {
        _cache = cache;
    }

    private List<EnumDto> GetOrSetCache<TEnum>(string cacheKey) where TEnum : Enum
    {
        if (!_cache.TryGetValue(cacheKey, out List<EnumDto> cachedEnum))
        {
            cachedEnum = EnumHelper.ConvertToList<TEnum>();

            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromHours(1));

            _cache.Set(cacheKey, cachedEnum, cacheEntryOptions);
        }

        return cachedEnum;
    }

    [HttpGet("customer-type")]
    public ActionResult<ApiResponse<List<EnumDto>>> GetCustomerType()
    {
        var result = GetOrSetCache<CustomerType>("CustomerTypeEnum");
        return ApiResponse<List<EnumDto>>.CreateSuccess(result);
    }

    [HttpGet("lead-status")]
    public ActionResult<ApiResponse<List<EnumDto>>> GetLeadStatus()
    {
        var result = GetOrSetCache<LeadStatus>("LeadStatusEnum");
        return ApiResponse<List<EnumDto>>.CreateSuccess(result);
    }

    [HttpGet("lead-source")]
    public ActionResult<ApiResponse<List<EnumDto>>> GetLeadSource()
    {
        var result = GetOrSetCache<LeadSource>("LeadSourceEnum");
        return ApiResponse<List<EnumDto>>.CreateSuccess(result);
    }

    [HttpGet("industry-type")]
    public ActionResult<ApiResponse<List<EnumDto>>> GetIndustryType()
    {
        var result = GetOrSetCache<IndustryType>("IndustryTypeEnum");
        return ApiResponse<List<EnumDto>>.CreateSuccess(result);
    }

    [HttpGet("interaction-type")]
    public ActionResult<ApiResponse<List<EnumDto>>> GetInteractionType()
    {
        var result = GetOrSetCache<InteractionType>("InteractionTypeEnum");
        return ApiResponse<List<EnumDto>>.CreateSuccess(result);
    }

    [HttpGet("sale-status")]
    public ActionResult<ApiResponse<List<EnumDto>>> GetSaleStatus()
    {
        var result = GetOrSetCache<SaleStatus>("SaleStatusEnum");
        return ApiResponse<List<EnumDto>>.CreateSuccess(result);
    }

    [HttpGet("ticket-status")]
    public ActionResult<ApiResponse<List<EnumDto>>> GetTicketStatus()
    {
        var result = GetOrSetCache<TicketStatus>("TicketStatusEnum");
        return ApiResponse<List<EnumDto>>.CreateSuccess(result);
    }

    [HttpGet("task-status")]
    public ActionResult<ApiResponse<List<EnumDto>>> GetTaskStatus()
    {
        var result = GetOrSetCache<CegCRMAPI.Domain.Entities.TaskStatus>("TaskStatusEnum");
        return ApiResponse<List<EnumDto>>.CreateSuccess(result);
    }

    [HttpGet("task-priority")]
    public ActionResult<ApiResponse<List<EnumDto>>> GetTaskPriority()
    {
        var result = GetOrSetCache<TaskPriority>("TaskPriorityEnum");
        return ApiResponse<List<EnumDto>>.CreateSuccess(result);
    }

    [HttpGet("task-type")]
    public ActionResult<ApiResponse<List<EnumDto>>> GetTaskType()
    {
        var result = GetOrSetCache<TaskType>("TaskTypeEnum");
        return ApiResponse<List<EnumDto>>.CreateSuccess(result);
    }
}
