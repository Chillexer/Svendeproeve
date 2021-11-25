using AutoMapper;
using FNO.Admin.AdminApi.Dtos.Product;
using FNO.DataAccess.Database.Models;

namespace FNO.Admin.AdminApi.Profiles
{
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            CreateMap<Product, BaseProductDto>().IncludeAllDerived();
            CreateMap<Product, ProductDto>().ForMember(dest => dest.Categories, opt => opt.Ignore());
            CreateMap<CreateProductDto, Product>();
            CreateMap<UpdateProductDto, Product>();
        }
    }
}
