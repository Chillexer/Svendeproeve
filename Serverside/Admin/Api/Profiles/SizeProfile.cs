using AutoMapper;
using FNO.Admin.AdminApi.Dtos;
using FNO.DataAccess.Database.Models;

namespace FNO.Admin.AdminApi.Profiles
{
    public class SizeProfile : Profile
    {
        public SizeProfile()
        {
            CreateMap<Size, SizeDto>();
        }
    }
}
