using CegCRMAPI.Domain.Entities.Common;
using System;
using System.Collections.Generic;

namespace CegCRMAPI.Domain.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public ICollection<SaleProduct> SaleProducts { get; set; } = new List<SaleProduct>();
    }
} 