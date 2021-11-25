using System.Collections.Generic;

namespace FNO.Admin.AdminApi.Dtos.Order
{
    public class OrderDto : BaseOrderDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string Town { get; set; }
        public int ZipCode { get; set; }
        public List<VariantOrderDto> VariantOrders { get; set; }
    }
}
