using AutoMapper;
using FNO.DataAccess.Database.Models;
using FNO.Shop.ShopApi.Dtos.Order;
using FNO.Shop.ShopApi.Dtos.Variant;

namespace FNO.Shop.ShopApi.Profiles
{
    public class VariantProfile : Profile
    {
        public VariantProfile()
        {
            CreateMap<Variant, BaseVariantDto>().IncludeAllDerived();
            CreateMap<Variant, VariantDto>();
            CreateMap<Variant, VariantWithoutProductDto>();
            CreateMap<Variant, GetVariantFromOrderDto>()
                .ForMember(dest => dest.Brand, opts => opts.MapFrom(src => src.Product.Brand))
                .ForMember(dest => dest.Model, opts => opts.MapFrom(src => src.Product.Model));
        }
    }
}
