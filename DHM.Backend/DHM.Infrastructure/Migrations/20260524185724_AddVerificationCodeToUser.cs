using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DHM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddVerificationCodeToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "VerificationCode",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "VerificationCodeExpiry",
                table: "AspNetUsers",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VerificationCode",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "VerificationCodeExpiry",
                table: "AspNetUsers");
        }
    }
}
