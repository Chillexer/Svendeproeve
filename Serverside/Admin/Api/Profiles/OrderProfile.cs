using AutoMapper;
using FNO.Admin.AdminApi.Dtos.Order;
using FNO.DataAccess.Database.Models;

namespace FNO.Admin.AdminApi.Profiles
{
    public class OrderProfile : Profile
    {
        public OrderProfile()
        {
            CreateMap<Order, BaseOrderDto>().IncludeAllDerived();
            CreateMap<Order, OrderDto>();
            CreateMap<CreateOrderDto, Order>().ForMember(dest => dest.VariantOrders, opts => opts.Ignore());
            CreateMap<UpdateOrderDto, Order>();
        }
    }
}
