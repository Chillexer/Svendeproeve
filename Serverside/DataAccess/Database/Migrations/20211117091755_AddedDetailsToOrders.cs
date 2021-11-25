using Microsoft.EntityFrameworkCore.Migrations;

namespace FNO.DataAccess.Database.Migrations
{
    public partial class AddedDetailsToOrders : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Orders",
                newName: "ZipCode");

            migrationBuilder.AddColumn<int>(
                name: "SizeId",
                table: "VariantOrders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Town",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_VariantOrders_SizeId",
                table: "VariantOrders",
                column: "SizeId");

            migrationBuilder.AddForeignKey(
                name: "FK_VariantOrders_Sizes_SizeId",
                table: "VariantOrders",
                column: "SizeId",
                principalTable: "Sizes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VariantOrders_Sizes_SizeId",
                table: "VariantOrders");

            migrationBuilder.DropIndex(
                name: "IX_VariantOrders_SizeId",
                table: "VariantOrders");

            migrationBuilder.DropColumn(
                name: "SizeId",
                table: "VariantOrders");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Town",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "ZipCode",
                table: "Orders",
                newName: "UserId");
        }
    }
}
