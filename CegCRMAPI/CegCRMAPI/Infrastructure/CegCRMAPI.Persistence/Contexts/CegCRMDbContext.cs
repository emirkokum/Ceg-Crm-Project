using CegCRMAPI.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace CegCRMAPI.Persistence.Context
{
    public class CegCrmDbContext : DbContext
    {
        public CegCrmDbContext(DbContextOptions<CegCrmDbContext> options): base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Interaction> Interactions { get; set; }
        public DbSet<Sale> Sales { get; set; }
        public DbSet<Lead> Leads { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Employee> Employees { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<Customer>().Property(c => c.Segment).HasMaxLength(50);
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
            modelBuilder.Entity<Employee>().HasIndex(e => e.Email).IsUnique();
        }
    }
}
