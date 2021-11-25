using FNO.Admin.AdminApi.Dtos.Product;

namespace FNO.Admin.AdminApi.Dtos.Order
{
    public class GetVariantFromOrderDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public BaseProductDto Product { get; set; }
        public string ImagePath { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
    }
}
