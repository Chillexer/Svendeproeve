namespace FNO.Admin.AdminApi.Dtos.Order
{
    public class VariantOrderDto
    {
        public int Id { get; set; }
        public int SizeId { get; set; }
        public SizeDto Size { get; set; }
        public int VariantId { get; set; }
        public GetVariantFromOrderDto Variant { get; set; }
        public int OrderId { get; set; }
        public int OrderedItemsTotal { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }
    }
}
