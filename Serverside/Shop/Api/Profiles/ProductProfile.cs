using AutoMapper;
using FNO.DataAccess.Database.Models;
using FNO.Shop.ShopApi.Dtos.Product;

namespace FNO.Shop.ShopApi.Profiles
{
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            CreateMap<Product, BaseProductDto>().IncludeAllDerived();
            CreateMap<Product, ProductDto>();
            CreateMap<Product, ProductWithVariantsDto>();
        }

    }
}
