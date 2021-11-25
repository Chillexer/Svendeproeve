namespace FNO.DataAccess.Database.Models
{
    public class Enums
    {
        public enum SizeType
        {
            OneSize,
            Shoes,
            Shirt,
            Jackets,
            Pants,
            Shorts,
            Belt,
        }

        public enum OrderStatus
        {
            New,
            Packing,
            Sent,
            Delivered,
            Cancelled,
        }
    }
}
