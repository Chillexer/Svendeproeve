using FNO.DataAccess.Database.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using static FNO.DataAccess.Database.Models.Enums;

namespace FNO.DataAccess.Database.Repos
{
    public interface IOrderRepo
    {
        public Task SaveChangesAsync();
        public Task<Order> GetOrderByIdAsync(int id);
        public Task<Order> GetOrderByEmailAndIdAsync(int id, string email);
        public Task<List<Order>> GetOrdersAsync();
        public Task<List<OrderKeyValue>> GetOrdersFromLast7DayDaysAsync();
        public Task CreateOrderAsync(Order order);
        public void UpdateOrder(Order order);
        public Task DeleteOrderByIdAsync(int id);
        Task<List<Order>> SearchForOrdersAsync(string search, List<OrderStatus> status);
    }
}
