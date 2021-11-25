using AutoMapper;
using FNO.Admin.AdminApi.Dtos.Order;
using FNO.DataAccess.Database.Models;

namespace FNO.Admin.AdminApi.Profiles
{
    public class VariantOrderProfile : Profile
    {
        public VariantOrderProfile()
        {
            CreateMap<VariantOrder, VariantOrderDto>();
        }
    }
}
