using DHM.Application.DTOs;
using System.Threading.Tasks;

namespace DHM.Application.Interfaces.Services
{
    public interface IAuthService
    {
        Task<RegisterResponseDto> RegisterAsync(RegisterDto request);
        Task<AuthResponseDto> VerifyAsync(VerifyDto request);
        Task<AuthResponseDto> LoginAsync(LoginDto request);
    }
}
