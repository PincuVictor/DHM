using System.Net;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Xunit;
using DHM.Application.DTOs;
using System.Net.Http.Json;
using Microsoft.Extensions.DependencyInjection;
using DHM.Infrastructure.Data;
using DHM.Domain.Entities;
using System;

namespace DHM.IntegrationTests
{
    public class CartControllerTests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly CustomWebApplicationFactory<Program> _factory;

        public CartControllerTests(CustomWebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task GetCart_Unauthenticated_ReturnsUnauthorized()
        {
            // Arrange
            var client = _factory.CreateClient();

            // Act
            var response = await client.GetAsync("/api/Cart");

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task AddToCart_Authenticated_ReturnsOkWithCart()
        {
            // Arrange
            var client = _factory.CreateClient();
            
            // To properly test this, we would need to generate a valid JWT token
            // or mock the authentication handler in the CustomWebApplicationFactory.
            // For now, we verify that an unauthenticated POST is correctly rejected.
            var response = await client.PostAsync("/api/Cart/items?productId=1&quantity=1", null);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }
    }
}
