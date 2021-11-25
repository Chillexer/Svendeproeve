using FNO.DataAccess.Database.Data;
using FNO.DataAccess.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static FNO.DataAccess.Database.Models.Enums;

namespace FNO.DataAccess.Database.Repos
{
    public class OrderRepo : IOrderRepo
    {
        private readonly ShopDbContext _dbContext;

        public OrderRepo(ShopDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task CreateOrderAsync(Order order)
        {
            await _dbContext.Orders.AddAsync(order);
        }

        public async Task DeleteOrderByIdAsync(int id)
        {
            var order = await _dbContext.Orders.FirstOrDefaultAsync(x => x.Id == id);

            _dbContext.Orders.Remove(order);
        }

        public async Task<List<OrderKeyValue>> GetOrdersFromLast7DayDaysAsync()
        {
            DateTime to = DateTime.Now;
            DateTime from = DateTime.Now.AddDays(-6);
            var fromDate = new DateTime(from.Year, from.Month, from.Day, 00, 00, 00);
            var toDate = new DateTime(to.Year, to.Month, to.Day, 23, 59, 59);

            var enumerable = await _dbContext.Orders.Where(o => o.CreatedAt < toDate && o.CreatedAt > fromDate).OrderBy(o => o.CreatedAt).ToListAsync();
            var orders = enumerable.GroupBy(o => o.CreatedAt.Value.Day).Select(o => new { count = o.Count(), date = o.FirstOrDefault().CreatedAt }).ToList();

            List<OrderKeyValue> keyValuePairs = new List<OrderKeyValue>();

            for (int i = 0; i <= 6; i++)
            {
                keyValuePairs.Add(new OrderKeyValue(fromDate.AddDays(i), 0));
            }

            foreach (var order in orders)
            {
                keyValuePairs.FirstOrDefault(k => k.Key == new DateTime(order.date.Value.Year, order.date.Value.Month, order.date.Value.Day, 00, 00, 00)).Value = order.count;
            }

            keyValuePairs.Sort((a, b) => a.Key.CompareTo(b.Key));

            return keyValuePairs;
        }

        public async Task<Order> GetOrderByIdAsync(int id)
        {
            return await _dbContext.Orders.IgnoreAutoIncludes().Include(o => o.VariantOrders)
                .ThenInclude(vo => vo.Variant.Product).Include(o => o.VariantOrders)
                .ThenInclude(vo => vo.Size).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Order> GetOrderByEmailAndIdAsync(int id, string email)
        {
            return await _dbContext.Orders.IgnoreAutoIncludes().Include(o => o.VariantOrders).ThenInclude(vo => vo.Variant.Product).Include(o => o.VariantOrders).ThenInclude(vo => vo.Size).FirstOrDefaultAsync(x => x.Id == id && x.Email.ToLower() == email.ToLower());
        }

        public async Task<List<Order>> GetOrdersAsync()
        {
            return await _dbContext.Orders.OrderByDescending(o => o.CreatedAt).Take(100).ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        public void UpdateOrder(Order order)
        {
            _dbContext.Orders.Update(order);
        }

        public async Task<List<Order>> SearchForOrdersAsync(string search, List<OrderStatus> status)
        {
            var query = _dbContext.Orders.AsQueryable();

            if (!string.IsNullOrEmpty(search))
                query = query.Where(o => o.Email.Contains(search) || o.FirstName.Contains(search) || o.LastName.Contains(search) || o.Address.Contains(search));
            if (status.Count() > 0)
                query = query.Where(o => status.Contains(o.Status));

            return await query.OrderByDescending(o => o.CreatedAt).Take(100).ToListAsync();
        }
    }
}
