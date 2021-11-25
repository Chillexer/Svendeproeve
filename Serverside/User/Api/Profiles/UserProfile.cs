using Auth0.ManagementApi.Models;
using AutoMapper;
using FNO.User.UserApi.Dtos;

namespace FNO.User.UserApi.Profiles
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<CreateUserDto, Models.User>().ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.Email));
            CreateMap<Models.User, UserDto>();
            CreateMap<CreateUserDto, UserCreateRequest>()
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
                .ForMember(dest => dest.Password, opt => opt.MapFrom(src => src.Password));

            CreateMap<UpdateUserDto, Models.User>();
        }
    }
}
