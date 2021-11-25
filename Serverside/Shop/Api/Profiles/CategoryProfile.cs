using AutoMapper;
using FNO.DataAccess.Database.Models;
using FNO.Shop.ShopApi.Dtos;

namespace FNO.Shop.ShopApi.Profiles
{
    public class CategoryProfile : Profile
    {
        public CategoryProfile()
        {
            CreateMap<Category, CategoryDto>();
            CreateMap<CategoryDto, Category>();
        }
    }
}
