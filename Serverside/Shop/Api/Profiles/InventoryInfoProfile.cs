using AutoMapper;
using FNO.DataAccess.Database.Models;
using FNO.Shop.ShopApi.Dtos;

namespace FNO.Shop.ShopApi.Profiles
{

    public class InventoryInfoProfile : Profile
    {
        public InventoryInfoProfile()
        {
            CreateMap<InventoryInfo, InventoryInfoDto>();
        }
    }

}
