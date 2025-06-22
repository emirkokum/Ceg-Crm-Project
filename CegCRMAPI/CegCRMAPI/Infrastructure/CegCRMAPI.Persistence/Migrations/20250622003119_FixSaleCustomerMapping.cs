using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CegCRMAPI.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixSaleCustomerMapping : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sales_Customers_CustomerId",
                table: "Sales");

            migrationBuilder.DropForeignKey(
                name: "FK_Sales_Employees_SalesPersonId",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "AssignedToEmployeeId",
                table: "Leads");

            migrationBuilder.AddColumn<Guid>(
                name: "CustomerId1",
                table: "Sales",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Sales_CustomerId1",
                table: "Sales",
                column: "CustomerId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Sales_Customers_CustomerId",
                table: "Sales",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Sales_Customers_CustomerId1",
                table: "Sales",
                column: "CustomerId1",
                principalTable: "Customers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Sales_Employees_SalesPersonId",
                table: "Sales",
                column: "SalesPersonId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sales_Customers_CustomerId",
                table: "Sales");

            migrationBuilder.DropForeignKey(
                name: "FK_Sales_Customers_CustomerId1",
                table: "Sales");

            migrationBuilder.DropForeignKey(
                name: "FK_Sales_Employees_SalesPersonId",
                table: "Sales");

            migrationBuilder.DropIndex(
                name: "IX_Sales_CustomerId1",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "CustomerId1",
                table: "Sales");

            migrationBuilder.AddColumn<Guid>(
                name: "AssignedToEmployeeId",
                table: "Leads",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Sales_Customers_CustomerId",
                table: "Sales",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Sales_Employees_SalesPersonId",
                table: "Sales",
                column: "SalesPersonId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
