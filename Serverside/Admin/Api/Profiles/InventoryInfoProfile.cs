using AutoMapper;
using FNO.Admin.AdminApi.Dtos;
using FNO.DataAccess.Database.Models;

namespace FNO.Admin.AdminApi.Profiles
{
    public class InventoryInfoProfile : Profile
    {
        public InventoryInfoProfile()
        {
            CreateMap<InventoryInfo, InventoryInfoDto>();
        }
    }
}
