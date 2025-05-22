using System;

namespace CegCRMAPI.Application.DTOs.Sale
{
    public record SaleProductItemDto
    {
        public Guid ProductId { get; init; }
        public int Quantity { get; init; }
        public decimal UnitPrice { get; init; }
    }
} 