using AutoMapper;
using FNO.DataAccess.Database.Models;
using FNO.Shop.ShopApi.Dtos;

namespace FNO.Shop.ShopApi.Profiles
{
    public class GenderProfile : Profile
    {
        public GenderProfile()
        {
            CreateMap<Gender, GenderDto>();
            CreateMap<GenderDto, Gender>();
        }
    }
}
