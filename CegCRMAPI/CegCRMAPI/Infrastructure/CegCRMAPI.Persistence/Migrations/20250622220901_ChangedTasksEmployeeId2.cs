using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CegCRMAPI.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ChangedTasksEmployeeId2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Employees_EmployeeId",
                table: "Tasks");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Users_AssignedUserId",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_AssignedUserId",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_EmployeeId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "AssignedUserId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "EmployeeId",
                table: "Tasks");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_AssignedEmployeeId",
                table: "Tasks",
                column: "AssignedEmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Employees_AssignedEmployeeId",
                table: "Tasks",
                column: "AssignedEmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Employees_AssignedEmployeeId",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_AssignedEmployeeId",
                table: "Tasks");

            migrationBuilder.AddColumn<Guid>(
                name: "AssignedUserId",
                table: "Tasks",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "EmployeeId",
                table: "Tasks",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_AssignedUserId",
                table: "Tasks",
                column: "AssignedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_EmployeeId",
                table: "Tasks",
                column: "EmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Employees_EmployeeId",
                table: "Tasks",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Users_AssignedUserId",
                table: "Tasks",
                column: "AssignedUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
