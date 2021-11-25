using AutoMapper;
using FNO.Admin.AdminApi.Dtos;
using FNO.DataAccess.Database.Models;

namespace FNO.Admin.AdminApi.Profiles
{
    public class ColorProfile : Profile
    {
        public ColorProfile()
        {
            CreateMap<Color, ColorDto>();
        }
    }
}
