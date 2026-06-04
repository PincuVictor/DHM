using DHM.Application.DTOs;
using DHM.Application.Interfaces.Services;
using DHM.Domain.Entities;
using DHM.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Moq;
using System;
using System.Threading.Tasks;
using Xunit;

namespace DHM.UnitTests.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<UserManager<User>> _mockUserManager;
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly Mock<IEmailService> _mockEmailService;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            var store = new Mock<IUserStore<User>>();
            _mockUserManager = new Mock<UserManager<User>>(store.Object, null, null, null, null, null, null, null, null);
            _mockConfiguration = new Mock<IConfiguration>();
            _mockEmailService = new Mock<IEmailService>();

            _authService = new AuthService(_mockUserManager.Object, _mockConfiguration.Object, _mockEmailService.Object);
        }

        [Fact]
        public async Task LoginAsync_InvalidEmailOrPassword_ThrowsException()
        {
            // Arrange
            _mockUserManager.Setup(um => um.FindByEmailAsync(It.IsAny<string>())).ReturnsAsync((User?)null);

            // Act & Assert
            var ex = await Assert.ThrowsAsync<Exception>(() => _authService.LoginAsync(new LoginDto { Email = "test@test.com", Password = "wrong" }));
            Assert.Contains("Invalid email or password", ex.Message);
        }

        [Fact]
        public async Task LoginAsync_UnverifiedEmail_ThrowsException()
        {
            // Arrange
            var user = new User { Email = "test@test.com", EmailConfirmed = false };
            _mockUserManager.Setup(um => um.FindByEmailAsync("test@test.com")).ReturnsAsync(user);
            _mockUserManager.Setup(um => um.CheckPasswordAsync(user, "password123")).ReturnsAsync(true);

            // Act & Assert
            var ex = await Assert.ThrowsAsync<Exception>(() => _authService.LoginAsync(new LoginDto { Email = "test@test.com", Password = "password123" }));
            Assert.Contains("Email not verified", ex.Message);
        }
    }
}
