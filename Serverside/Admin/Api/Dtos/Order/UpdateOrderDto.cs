using FNO.DataAccess.Database.Models;
using System.ComponentModel.DataAnnotations;

namespace FNO.Admin.AdminApi.Dtos.Order
{
    public class UpdateOrderDto
    {
        [Required]
        public Enums.OrderStatus Status { get; set; }

    }
}
