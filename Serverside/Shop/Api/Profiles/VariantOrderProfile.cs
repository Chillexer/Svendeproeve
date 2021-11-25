using AutoMapper;
using FNO.DataAccess.Database.Models;
using FNO.Shop.ShopApi.Dtos.Order;

namespace FNO.Shop.ShopApi.Profiles
{
    public class VariantOrderProfile : Profile
    {
        public VariantOrderProfile()
        {
            CreateMap<VariantOrder, VariantOrderDto>();
        }
    }
}
