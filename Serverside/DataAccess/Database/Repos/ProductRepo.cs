using FNO.DataAccess.Database.Data;
using FNO.DataAccess.Database.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FNO.DataAccess.Database.Repos
{
    public class ProductRepo : IProductRepo
    {
        private readonly ShopDbContext _dbContext;

        public ProductRepo(ShopDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task CreateProductAsync(Product product)
        {
            await _dbContext.Products.AddAsync(product);
        }

        public async Task DeleteProductByIdAsync(int id)
        {
            var product = await _dbContext.Products.FirstOrDefaultAsync(x => x.Id == id);

            _dbContext.Products.Remove(product);
        }

        public async Task<Product> GetProductByIdAsync(int id)
        {
            return await _dbContext.Products.Include(p => p.Variants).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Product> GetProductsByGenderAsync(int genderId)
        {
            return await _dbContext.Products.FirstOrDefaultAsync(c => c.Gender.Id == genderId);
        }

        public async Task<List<Product>> GetProductsAsync()
        {
            return await _dbContext.Products.Take(100).ToListAsync();
        }

        public async Task<List<Product>> SearchForProductsAsync(string search)
        {
            return await (from p in _dbContext.Products
                          where p.Model.Contains(search) || p.Brand.Contains(search)
                          || p.Id.ToString().Contains(search)
                          orderby p.Id, p.Model, p.Brand
                          select p).Take(100).ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        public void UpdateProduct(Product product)
        {
            _dbContext.Products.Update(product);
        }

        public async Task<List<string>> GetBrandsAsync(string gender, string category)
        {
            var genderCategory = await _dbContext.Categories.Where(c => c.CategoryName.ToLower() == gender.ToLower()).FirstOrDefaultAsync();

            Category cat = null;
            if (!string.IsNullOrWhiteSpace(category))
                cat = await _dbContext.Categories
                    .Where(c => c.CategoryName.ToLower() == category.ToLower() && c.Left > genderCategory.Left && c.Right < genderCategory.Right)
                    .AsSplitQuery().FirstOrDefaultAsync();
            if (cat != null)
                return await _dbContext.Products
                    .Where(p => p.Gender.GenderName.Contains(gender) && p.Categories.Any(c => c.Left >= cat.Left && c.Right <= cat.Right))
                    .GroupBy(p => p.Brand).AsSplitQuery().Select(p => p.Key).ToListAsync();
            else
                return await _dbContext.Products
                 .Where(p => p.Gender.GenderName.Contains(gender))
                 .GroupBy(p => p.Brand).AsSplitQuery().Select(p => p.Key).ToListAsync();
        }
    }
}
