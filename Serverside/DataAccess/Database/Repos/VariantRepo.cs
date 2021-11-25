using FNO.DataAccess.Database.Data;
using FNO.DataAccess.Database.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static FNO.DataAccess.Database.Models.Enums;

namespace FNO.DataAccess.Database.Repos
{
    public class VariantRepo : IVariantRepo
    {
        private readonly ShopDbContext _dbContext;

        public VariantRepo(ShopDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task CreateVariantAsync(Variant variant)
        {
            await _dbContext.Variants.AddAsync(variant);
        }

        public async Task DeleteVariantByIdAsync(int id)
        {
            var variant = await _dbContext.Variants.FirstOrDefaultAsync(x => x.Id == id);

            _dbContext.Variants.Remove(variant);
        }

        public async Task<List<Variant>> GetTop6SellingVaraintsAsync()
        {
            var variantOrders = await (from vo in _dbContext.VariantOrders
                                       group vo by vo.VariantId into g
                                       select new { g.Key, TotalOrdered = g.Sum(vo => vo.OrderedItemsTotal) }).OrderByDescending(g => g.TotalOrdered).Take(6).ToListAsync();

            return variantOrders.Select(x => _dbContext.Variants.Include(v => v.Product).FirstOrDefault(v => v.Id == x.Key)).ToList();
        }


        public async Task<Variant> GetVariantByIdAsync(int id, bool includeProduct = false)
        {
            if (includeProduct)
                return await _dbContext.Variants.Include(v => v.Product).FirstOrDefaultAsync(x => x.Id == id);
            return await _dbContext.Variants.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<Variant>> GetVariantsAsync()
        {
            return await _dbContext.Variants.Take(100).Include(v => v.Product).ThenInclude(p => p.Categories).ToListAsync();
        }

        public async Task<List<Variant>> GetVariantsByGenderAsync(string gender)
        {
            return await _dbContext.Variants.Where(v => v.Product.Gender.GenderName.ToLower() == gender.ToLower()).Take(100).Include(v => v.Product).ThenInclude(p => p.Categories).ToListAsync();
        }

        public async Task<List<Variant>> SearchForVariantsAsync(string search)
        {
            return await (from v in _dbContext.Variants
                          where v.Product.Model.Contains(search) || v.Product.Brand.Contains(search)
                          || v.Id.ToString().Contains(search)
                          orderby v.Id, v.Product.Model, v.Product.Brand
                          select v).Take(100).Include(v => v.Product).Include(v => v.InventoryInfos).AsSplitQuery().ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        public void UpdateVariant(Variant variant)
        {
            _dbContext.Variants.Update(variant);
        }

        public async Task<List<Variant>> SearchVariantsByGenderAndCategoryAsync(string gender, string category = null, string brand = null, SizeType? sizeType = null, int? sizeId = null, int? priceFrom = null, int? priceTo = null)
        {
            var query = _dbContext.Variants.Where(v => v.Product.Gender.GenderName.ToLower() == gender.ToLower());
            if (category != null)
            {
                var genderCategory = await _dbContext.Categories.Where(c => c.CategoryName.ToLower() == gender.ToLower()).FirstOrDefaultAsync();
                var cat = await _dbContext.Categories.Where(c => c.CategoryName.ToLower() == category.ToLower() && c.Left > genderCategory.Left && c.Right < genderCategory.Right).AsSplitQuery().FirstOrDefaultAsync();
                if (cat != null)
                    query = query.Where(v => v.Product.Categories.Any(c => c.Left >= cat.Left && c.Right <= cat.Right));
            }
            if (brand != null)
                query = query.Where(v => v.Product.Brand.ToLower() == brand.ToLower());
            if (sizeType != null)
            {
                query = query.Where(v => v.Product.SizeType == sizeType);
                if (sizeId != null)
                    query = query.Where(v => v.InventoryInfos.Any(i => i.SizeId == sizeId));
            }
            if (priceFrom != null && priceTo == null)
                query = query.Where(v => ((v.DiscountPrice.HasValue && v.DiscountPrice > priceFrom) || v.Product.Price > priceFrom));
            else if (priceFrom != null && priceTo != null)
                query = query.Where(v => ((v.DiscountPrice.HasValue && v.DiscountPrice > priceFrom) || v.Product.Price > priceFrom) &&
                ((v.DiscountPrice.HasValue && v.DiscountPrice < priceTo) || v.Product.Price < priceFrom));

            return await query.OrderBy(v => v.Id).Take(100).Include(v => v.Product).ThenInclude(p => p.Categories).AsSplitQuery().ToListAsync();
        }

    }
}
