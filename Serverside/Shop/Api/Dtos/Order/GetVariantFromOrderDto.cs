namespace FNO.Shop.ShopApi.Dtos.Order
{
    public class GetVariantFromOrderDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ImagePath { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
    }
}
