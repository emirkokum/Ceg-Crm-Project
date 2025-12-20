using CegCRMAPI.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CegCRMAPI.Persistence.Context
{
    public class CegCrmDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {
        public CegCrmDbContext(DbContextOptions<CegCrmDbContext> options): base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Interaction> Interactions { get; set; }
        public DbSet<Sale> Sales { get; set; }
        public DbSet<Lead> Leads { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Note> Notes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<IdentityRole<Guid>>().ToTable("Roles");
            modelBuilder.Entity<IdentityUserRole<Guid>>().ToTable("UserRoles");
            modelBuilder.Entity<IdentityUserClaim<Guid>>().ToTable("UserClaims");
            modelBuilder.Entity<IdentityUserLogin<Guid>>().ToTable("UserLogins");
            modelBuilder.Entity<IdentityRoleClaim<Guid>>().ToTable("RoleClaims");
            modelBuilder.Entity<IdentityUserToken<Guid>>().ToTable("UserTokens");
            modelBuilder.Entity<Sale>()
                .HasOne(s => s.Customer)
                .WithMany()
                .HasForeignKey(s => s.CustomerId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();

            modelBuilder.Entity<Sale>()
                .HasOne(s => s.SalesPerson)
                .WithMany()
                .HasForeignKey(s => s.SalesPersonId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();



            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.Property(u => u.FirstName).IsRequired().HasMaxLength(50);
                entity.Property(u => u.LastName).IsRequired().HasMaxLength(50);
                entity.Property(u => u.PhoneNumber).HasMaxLength(20);
            });

            // Configure Employee entity
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.ToTable("Employees");
                entity.Property(e => e.EmployeeNumber).IsRequired().HasMaxLength(50);
                entity.Property(e => e.WorkEmail).IsRequired().HasMaxLength(100);
                entity.Property(e => e.WorkPhone).HasMaxLength(20);
                entity.Property(e => e.EmergencyContact).HasMaxLength(100);
                entity.Property(e => e.EmergencyPhone).HasMaxLength(20);
                entity.Property(e => e.BankAccount).HasMaxLength(50);
                entity.Property(e => e.TaxNumber).HasMaxLength(50);
            });

            // Configure other entities
            modelBuilder.Entity<Ticket>().Property(t => t.Status).HasMaxLength(30);
            modelBuilder.Entity<Interaction>().Property(i => i.Type).HasMaxLength(50);
            modelBuilder.Entity<Sale>().Property(s => s.Status).HasMaxLength(30);
            modelBuilder.Entity<Sale>().Property(s => s.InvoiceNumber).HasMaxLength(50);
            modelBuilder.Entity<Lead>().Property(l => l.Status).HasMaxLength(30);
            modelBuilder.Entity<Lead>().Property(l => l.Source).HasMaxLength(50);
            modelBuilder.Entity<TaskItem>().Property(t => t.Status).HasMaxLength(30);
            modelBuilder.Entity<TaskItem>().Property(t => t.Priority).HasMaxLength(20);
            modelBuilder.Entity<TaskItem>().Property(t => t.Type).HasMaxLength(50);
            modelBuilder.Entity<Product>().Property(p => p.Name).HasMaxLength(100);
            modelBuilder.Entity<Employee>().HasIndex(e => e.WorkEmail).IsUnique();
        }
    }
}
