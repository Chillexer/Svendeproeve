using AutoMapper;
using FNO.Admin.AdminApi.Dtos.Order;
using FNO.Admin.AdminApi.Dtos.Variant;
using FNO.DataAccess.Database.Models;

namespace FNO.Admin.AdminApi.Profiles
{
    public class VariantProfile : Profile
    {
        public VariantProfile()
        {
            CreateMap<Variant, BaseVariantDto>().IncludeAllDerived();
            CreateMap<Variant, VariantDto>();
            CreateMap<CreateVariantDto, Variant>().ForMember(dest => dest.InventoryInfos, opts => opts.Ignore());
            CreateMap<UpdateVariantDto, Variant>().ForMember(dest => dest.InventoryInfos, opts => opts.Ignore())
                .ForMember(dest => dest.Colors, opts => opts.Ignore());

            CreateMap<Variant, GetVariantFromOrderDto>()
                .ForMember(dest => dest.Brand, opts => opts.MapFrom(src => src.Product.Brand))
                .ForMember(dest => dest.Model, opts => opts.MapFrom(src => src.Product.Model));

        }
    }
}
