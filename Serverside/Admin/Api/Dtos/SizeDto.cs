using FNO.DataAccess.Database.Models;

namespace FNO.Admin.AdminApi.Dtos
{
    public class SizeDto
    {
        public int Id { get; set; }
        public string SizeName { get; set; }
        public Enums.SizeType SizeType { get; set; }
    }
}
