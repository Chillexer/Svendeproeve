using Auth0.ManagementApi;
using Microsoft.Extensions.Configuration;
using RestSharp;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace FNO.User.UserApi.IntegrationClients
{
    public class ManagementClient : IManagementClient
    {
        private readonly ManagementApiClient _client;
        private static string token;
        public ManagementApiClient Client { get { return _client; } }
        public ManagementClient(IConfiguration configuration, IManagementConnection connection)
        {
            string tenant = configuration["Auth0:Tenant"];
            string domain = configuration["Auth0:Domain"];
            string audience = configuration["Auth0:ManagementApiIdentifier"];
            string clientId = configuration["Auth0:ClientId"];
            string clientSecret = configuration["Auth0:ClientSecret"];
            string token = GetToken(domain, audience, clientId, clientSecret);
            _client = new ManagementApiClient(token, tenant, connection);
        }

        private static string GetToken(string domain, string audience, string clientId, string clientSecret)
        {
            if (!string.IsNullOrWhiteSpace(token))
            {
                var jwtToken = new JwtSecurityToken(token);
                if (!((jwtToken == null) || (jwtToken.ValidFrom > DateTime.UtcNow) || (jwtToken.ValidTo < DateTime.UtcNow)))
                    return token;
            }

            var client = new RestClient(domain + "oauth/token");
            var request = new RestRequest(Method.POST);
            request.AddHeader("content-type", "application/x-www-form-urlencoded");
            request.AddParameter("application/x-www-form-urlencoded",
                $"grant_type=client_credentials&client_id={clientId}&client_secret={clientSecret}&audience={audience}",
                ParameterType.RequestBody);
            IRestResponse response = client.Execute(request);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                token = JsonSerializer.Deserialize<TokenResponse>(response.Content).AccessToken;
                return token;
            }
            throw new Exception(response.Content);
        }

        private class TokenResponse
        {
            [JsonPropertyName("access_token")]
            public string AccessToken { get; set; }
        }

    }
}
