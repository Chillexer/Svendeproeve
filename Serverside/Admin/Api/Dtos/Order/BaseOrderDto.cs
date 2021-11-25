using FNO.DataAccess.Database.Models;
using System;

namespace FNO.Admin.AdminApi.Dtos.Order
{
    public class BaseOrderDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public Enums.OrderStatus Status { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
