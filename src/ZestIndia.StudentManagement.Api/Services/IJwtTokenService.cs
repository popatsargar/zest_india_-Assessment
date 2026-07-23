using ZestIndia.StudentManagement.Api.Models.Auth;

namespace ZestIndia.StudentManagement.Api.Services;

public interface IJwtTokenService
{
    Task<LoginResponseDto> GenerateTokenAsync(string username, CancellationToken cancellationToken = default);
}
