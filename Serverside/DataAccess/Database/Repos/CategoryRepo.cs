using FNO.DataAccess.Database.Data;
using FNO.DataAccess.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FNO.DataAccess.Database.Repos
{
    public class CategoryRepo : ICategoryRepo
    {
        private readonly ShopDbContext _dbContext;

        public CategoryRepo(ShopDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Category>> GetCategoriesAsync()
        {
            return await _dbContext.Categories.ToListAsync();
        }

        public async Task<Category> GetCategoryByIdAsync(int id)
        {
            return await _dbContext.Categories.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<List<NestedCategory>> GetCategoriesByGenderAsync(string gender)
        {
            var category = await _dbContext.Categories.FirstOrDefaultAsync(c => c.CategoryName == gender);
            if (category == null)
                throw new Exception("Not found");

            var categories = await (from Category t1 in _dbContext.Categories
                                    where category.Left <= t1.Left && category.Right >= t1.Right
                                    orderby (t1.Left)
                                    select new
                                    NestedCategory()
                                    {
                                        Id = t1.Id,
                                        Name = t1.CategoryName,
                                        ParentId = (from t2 in _dbContext.Categories
                                                    where t2.Left < t1.Left && t2.Right > t1.Right
                                                    orderby t2.Right - t1.Right ascending
                                                    select t2.Id).FirstOrDefault()
                                    }).ToListAsync();

            var sortedCategories = categories.Where(c => c.Id == category.Id).ToList();

            List<NestedCategory> currentSelection = sortedCategories;

            while (categories.Any(c => currentSelection.Any(cu => cu.Id == c.ParentId)))
            {
                List<NestedCategory> tempSelection = new List<NestedCategory>();

                foreach (var cat in currentSelection)
                {
                    cat.ChildCategories = categories.Where(c => c.ParentId == cat.Id).ToList();
                    tempSelection.AddRange(cat.ChildCategories);
                }

                currentSelection = tempSelection;
            }

            return sortedCategories;
        }

        public async Task<List<CategorySearch>> SearchByNameAsync(string gender, string name)
        {
            var category = await _dbContext.Categories.FirstOrDefaultAsync(c => c.CategoryName == gender);
            if (category == null)
                throw new Exception("Not found");

            return await (from Category t1 in _dbContext.Categories
                          where t1.CategoryName.StartsWith(name) && category.Left < t1.Left && category.Right > t1.Right
                          select new
                          CategorySearch()
                          {
                              Id = t1.Id,
                              Name = t1.CategoryName,
                              ParentName = (from t2 in _dbContext.Categories
                                            where t2.Left < t1.Left && t2.Right > t1.Right
                                            orderby t2.Right - t1.Right ascending
                                            select t2.CategoryName).FirstOrDefault()
                          }).ToListAsync();
        }

        public async Task<CategorySearch> SearchByIdAsync(string gender, int id)
        {
            var category = await _dbContext.Categories.FirstOrDefaultAsync(c => c.CategoryName == gender);
            if (category == null)
                throw new Exception("Not found");

            return await (from Category t1 in _dbContext.Categories
                          where t1.Id == id && category.Left < t1.Left && category.Right > t1.Right
                          select new
                          CategorySearch()
                          {
                              Id = t1.Id,
                              Name = t1.CategoryName,
                              ParentName = (from t2 in _dbContext.Categories
                                            where t2.Left < t1.Left && t2.Right > t1.Right
                                            orderby t2.Right - t1.Right ascending
                                            select t2.CategoryName).FirstOrDefault()
                          }).FirstOrDefaultAsync();
        }
    }
}
