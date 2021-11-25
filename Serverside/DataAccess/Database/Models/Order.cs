using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FNO.DataAccess.Database.Models
{
    public class Order : BaseEntity
    {
        [Key]
        public int Id { get; set; }
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
        public string Email { get; set; }
        [Required]
        public Enums.OrderStatus Status { get; set; }
        [Required]
        public List<VariantOrder> VariantOrders { get; set; }
    }
}
