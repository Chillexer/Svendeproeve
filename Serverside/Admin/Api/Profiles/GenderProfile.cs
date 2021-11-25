using AutoMapper;
using FNO.Admin.AdminApi.Dtos;
using FNO.DataAccess.Database.Models;

namespace FNO.Admin.AdminApi.Profiles
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
