using System;
using System.Collections.Generic;
using CegCRMAPI.Application.DTOs.Product;
using static CegCRMAPI.Domain.Entities.Sale;

namespace CegCRMAPI.Application.DTOs.Sale
{
    public class SaleDto
    {
        public Guid Id { get; set; }
        public DateTime SaleDate { get; set; }
        public Guid CustomerId { get; set; }
        public Guid SalesPersonId { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal Discount { get; set; }
        public decimal Tax { get; set; }
        public decimal FinalAmount { get; set; }
        public SaleStatus Status { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public ICollection<SaleProductDto> SaleProducts { get; set; } = new List<SaleProductDto>();
    }

    public class SaleProductDto
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }
} 