using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FNO.Admin.AdminApi.Dtos.Order
{
    public class CreateOrderDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public string Town { get; set; }
        [Required]
        public int ZipCode { get; set; }
        [Required]
        public List<CreateVariantOrderDto> VariantOrders { get; set; }
    }
}
