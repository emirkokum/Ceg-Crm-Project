# Some Entites

# Ek CRM Entity'leri

Bu dosya, CRM projesine eklenebilecek ek entity'leri ve özelliklerini içerir. Bu entity'ler ileride projeye eklenecektir.

## 1. Product (Ürün)
```csharp
public class Product : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string SKU { get; set; }  // Stok Kodu
    public string Category { get; set; }
    public int StockQuantity { get; set; }
    public bool IsActive { get; set; }
    
    // Navigation
    public ICollection<Sale> Sales { get; set; } = new List<Sale>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
```

## 2. Order (Sipariş)
```csharp
public class Order : BaseEntity
{
    public Guid CustomerId { get; set; }
    public string OrderNumber { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; }  // Pending, Processing, Shipped, Delivered, Cancelled
    public string PaymentStatus { get; set; }  // Pending, Paid, Failed, Refunded
    public string ShippingAddress { get; set; }
    public string BillingAddress { get; set; }
    
    // Navigation
    public Customer Customer { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
```

## 3. OrderItem (Sipariş Kalemi)
```csharp
public class OrderItem : BaseEntity
{
    public Guid OrderId { get; set; }
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    
    // Navigation
    public Order Order { get; set; }
    public Product Product { get; set; }
}
```

## 4. Payment (Ödeme)
```csharp
public class Payment : BaseEntity
{
    public Guid OrderId { get; set; }
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; }  // CreditCard, BankTransfer, Cash
    public string TransactionId { get; set; }
    public string Status { get; set; }  // Pending, Completed, Failed, Refunded
    public DateTime PaymentDate { get; set; }
    
    // Navigation
    public Order Order { get; set; }
}
```

## 5. Campaign (Kampanya)
```csharp
public class Campaign : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; }  // Active, Inactive, Completed
    public string Type { get; set; }  // Discount, Promotion, Event
    public decimal DiscountRate { get; set; }
    
    // Navigation
    public ICollection<Customer> Customers { get; set; } = new List<Customer>();
}
```

## 6. Task (Görev)
```csharp
public class Task : BaseEntity
{
    public Guid AssignedUserId { get; set; }
    public Guid? CustomerId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime DueDate { get; set; }
    public string Priority { get; set; }  // Low, Medium, High
    public string Status { get; set; }  // Pending, InProgress, Completed, Cancelled
    public string Type { get; set; }  // Call, Meeting, FollowUp, Other
    
    // Navigation
    public User AssignedUser { get; set; }
    public Customer Customer { get; set; }
}
```

## 7. Document (Doküman)
```csharp
public class Document : BaseEntity
{
    public Guid CustomerId { get; set; }
    public string Title { get; set; }
    public string FileName { get; set; }
    public string FileType { get; set; }
    public long FileSize { get; set; }
    public string FilePath { get; set; }
    public string Category { get; set; }  // Contract, Invoice, Report, Other
    
    // Navigation
    public Customer Customer { get; set; }
}
```

## 8. Note (Not)
```csharp
public class Note : BaseEntity
{
    public Guid CustomerId { get; set; }
    public Guid CreatedById { get; set; }
    public string Content { get; set; }
    public string Category { get; set; }  // General, Meeting, Call, Other
    public bool IsPrivate { get; set; }
    
    // Navigation
    public Customer Customer { get; set; }
    public User CreatedBy { get; set; }
}
```

## 9. Lead (Potansiyel Müşteri)
```csharp
public class Lead : BaseEntity
{
    public string CompanyName { get; set; }
    public string ContactName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Source { get; set; }  // Website, Referral, Social Media, Other
    public string Status { get; set; }  // New, Contacted, Qualified, Converted, Lost
    public string Industry { get; set; }
    public string Notes { get; set; }
    
    // Navigation
    public ICollection<Interaction> Interactions { get; set; } = new List<Interaction>();
}
```

## 10. Contract (Sözleşme)
```csharp
public class Contract : BaseEntity
{
    public Guid CustomerId { get; set; }
    public string ContractNumber { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; }  // Active, Expired, Terminated
    public decimal Value { get; set; }
    public string Terms { get; set; }
    public string Type { get; set; }  // Service, Product, Maintenance
    
    // Navigation
    public Customer Customer { get; set; }
    public ICollection<Document> Documents { get; set; } = new List<Document>();
}
```
## Not
Bu entity'ler ileride projeye eklenecektir. Şu an için mevcut entity'ler (Customer, User, Ticket, Interaction, Sale) ile devam edilecektir.