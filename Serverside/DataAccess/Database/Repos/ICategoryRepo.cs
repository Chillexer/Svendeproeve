using FNO.DataAccess.Database.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FNO.DataAccess.Database.Repos
{
    public interface ICategoryRepo
    {
        public Task<Category> GetCategoryByIdAsync(int id);
        public Task<List<Category>> GetCategoriesAsync();
        public Task<List<CategorySearch>> SearchByNameAsync(string gender, string name);
        public Task<List<NestedCategory>> GetCategoriesByGenderAsync(string gender);
        Task<CategorySearch> SearchByIdAsync(string gender, int id);
    }
}
