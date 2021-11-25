using Microsoft.EntityFrameworkCore.Migrations;

namespace FNO.DataAccess.Database.Migrations
{
    public partial class AddedHexValueToColor : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HexValue",
                table: "Colors",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HexValue",
                table: "Colors");
        }
    }
}
