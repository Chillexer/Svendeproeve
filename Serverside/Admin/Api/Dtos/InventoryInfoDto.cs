namespace FNO.Admin.AdminApi.Dtos
{
    public class InventoryInfoDto
    {
        public int VariantId { get; set; }
        public int SizeId { get; set; }
        public SizeDto Size { get; set; }
        public int TotalAmount { get; set; }
    }
}
