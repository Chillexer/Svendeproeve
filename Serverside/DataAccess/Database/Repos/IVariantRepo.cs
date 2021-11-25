using FNO.DataAccess.Database.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using static FNO.DataAccess.Database.Models.Enums;

namespace FNO.DataAccess.Database.Repos
{
    public interface IVariantRepo
    {
        public Task SaveChangesAsync();
        public Task<Variant> GetVariantByIdAsync(int id, bool includeProduct = false);
        public Task<List<Variant>> GetVariantsAsync();
        public Task<List<Variant>> GetVariantsByGenderAsync(string gender);
        public Task<List<Variant>> SearchForVariantsAsync(string search);
        public Task CreateVariantAsync(Variant Variant);
        public void UpdateVariant(Variant Variant);
        public Task DeleteVariantByIdAsync(int id);
        public Task<List<Variant>> GetTop6SellingVaraintsAsync();
        public Task<List<Variant>> SearchVariantsByGenderAndCategoryAsync(string gender, string category = null, string brand = null, SizeType? sizeType = null, int? sizeId = null, int? priceFrom = null, int? priceTo = null);
    }
}
