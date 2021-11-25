using AutoMapper;
using FNO.DataAccess.Database.Models;
using FNO.Shop.ShopApi.Dtos.Order;

namespace FNO.Shop.ShopApi.Profiles
{
    public class OrderProfile : Profile
    {
        public OrderProfile()
        {
            CreateMap<Order, BaseOrderDto>().IncludeAllDerived();
            CreateMap<Order, OrderDto>();
            CreateMap<CreateOrderDto, Order>().ForMember(dest => dest.VariantOrders, opts => opts.Ignore());
        }
    }
}
