using FNO.DataAccess.Database.Models;

namespace FNO.Shop.ShopApi.Dtos
{
    public class SizeDto
    {
        public int Id { get; set; }
        public string SizeName { get; set; }
        public Enums.SizeType SizeType { get; set; }
    }
}
