using Auth0.ManagementApi;

namespace FNO.User.UserApi.IntegrationClients
{
    public interface IManagementClient
    {
        public ManagementApiClient Client { get; }
    }
}
