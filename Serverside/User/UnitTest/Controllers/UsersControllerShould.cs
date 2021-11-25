using AutoMapper;
using FakeItEasy;
using FNO.User.UserApi.Controllers;
using FNO.User.UserApi.Dtos;
using FNO.User.UserApi.IntegrationClients;
using FNO.User.UserApi.Repos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;

namespace FNO.Authentication.UnitTest.Controllers
{
    public class UsersControllerShould
    {
        [Theory]
        [InlineData(true, false, false)]
        [InlineData(false, true, false)]
        [InlineData(false, false, true)]
        public void ShouldThrowArgumentNullExceptionWhenAParameterIsMissing(bool mapper, bool userRepo, bool managementClient)
        {
            //Arrange
            IManagementClient dummyManagementClient = managementClient ? A.Dummy<IManagementClient>() : null;
            IMapper dummyMapper = mapper ? A.Dummy<IMapper>() : null;
            IUserRepo dummyUserRepo = userRepo ? A.Dummy<IUserRepo>() : null;

            //Act
#pragma warning disable CA1806 // Do not ignore method results
            void action() => new UsersController(dummyManagementClient, dummyMapper, dummyUserRepo);
#pragma warning restore CA1806 // Do not ignore method results

            //Assert
            Assert.Throws<ArgumentNullException>(action);
        }

        [Fact]
        public async Task GetAuthenticatedUserAsyncReturnsUser()
        {
            //Arrange
            var expectedValue = GetFakeUserDto();
            IManagementClient dummyManagementClient = A.Dummy<IManagementClient>();
            IMapper fakeMapper = A.Fake<IMapper>();
            IUserRepo fakeUserRepo = A.Fake<IUserRepo>();
            A.CallTo(() => fakeMapper.Map<UserDto>(A<User.UserApi.Models.User>.Ignored)).Returns(expectedValue);
            A.CallTo(() => fakeUserRepo.GetUserByAuth0IdAsync(A<string>.Ignored)).Returns(new User.UserApi.Models.User());

            //Act
            var result = await GetFakeUsersController(dummyManagementClient, fakeMapper, fakeUserRepo, true).GetAuthenticatedUserAsync();
            var dto = ((UserDto)((OkObjectResult)result.Result).Value);

            //Assert
            Assert.Same(expectedValue, dto);
            Assert.Equal(expectedValue.Email, dto.Email);
            Assert.Equal(expectedValue.Address, dto.Address);
            Assert.Equal(expectedValue.UpdatedAt, dto.UpdatedAt);
            Assert.Equal(expectedValue.Id, dto.Id);
        }

        [Fact]
        public async Task GetAuthenticatedUserAsyncFailsWhenUserIdIsntFound()
        {
            //Arrange
            IManagementClient dummyManagementClient = A.Dummy<IManagementClient>();
            IMapper dummyMapper = A.Dummy<IMapper>();
            IUserRepo dummyUserRepo = A.Dummy<IUserRepo>();

            //Act
            var result = (await GetFakeUsersController(dummyManagementClient, dummyMapper, dummyUserRepo, false).GetAuthenticatedUserAsync()).Result;

            //Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task GetAuthenticatedUserAsyncFailsWhenUserIsntFound()
        {
            //Arrange
            User.UserApi.Models.User expectedValue = null;
            IManagementClient dummyManagementClient = A.Dummy<IManagementClient>();
            IMapper dummyMapper = A.Dummy<IMapper>();
            IUserRepo fakeUserRepo = A.Fake<IUserRepo>();
            A.CallTo(() => fakeUserRepo.GetUserByAuth0IdAsync(A<string>.Ignored)).Returns(expectedValue);

            //Act
            var result = (await GetFakeUsersController(dummyManagementClient, dummyMapper, fakeUserRepo, true).GetAuthenticatedUserAsync()).Result;

            //Assert
            Assert.IsType<NotFoundResult>(result);
        }



        private static UsersController GetFakeUsersController(IManagementClient managementClient, IMapper mapper, IUserRepo userRepo, bool isAuthenticated)
        {
            var controller = new UsersController(managementClient, mapper, userRepo);
            ClaimsPrincipal user;
            if (isAuthenticated)
            {
                user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[] {
                                        new Claim(ClaimTypes.NameIdentifier, "SomeValueHere"),
                                        new Claim(ClaimTypes.Name, "gunnar@somecompany.com")
                                        // other required and custom claims
                                   }, "TestAuthentication"));

            }
            else
            {
                user = new ClaimsPrincipal(new ClaimsIdentity(Array.Empty<Claim>(), "TestAuthentication"));
            }

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };
            return controller;
        }

        private static UserDto GetFakeUserDto()
        {
            return new UserDto()
            {
                Id = Guid.NewGuid(),
                Address = "Test",
                Email = "Test@Email.com",
                UpdatedAt = new DateTime(1999, 5, 23)
            };
        }
    }
}
