using FNO.DataAccess.Database.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FNO.DataAccess.Database.Repos
{
    public interface IProductRepo
    {
        public Task SaveChangesAsync();
        public Task<Product> GetProductByIdAsync(int id);
        public Task<Product> GetProductsByGenderAsync(int genderId);
        public Task<List<Product>> GetProductsAsync();
        public Task<List<Product>> SearchForProductsAsync(string search);
        public Task CreateProductAsync(Product product);
        public void UpdateProduct(Product product);
        public Task DeleteProductByIdAsync(int id);
        public Task<List<string>> GetBrandsAsync(string gender, string category);
    }
}
