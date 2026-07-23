using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZestIndia.StudentManagement.Api.Models.Auth;
using ZestIndia.StudentManagement.Api.Services;

namespace ZestIndia.StudentManagement.Api.Controllers;

/// <summary>
/// Provides authentication endpoints.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController(IConfiguration configuration, IJwtTokenService jwtTokenService) : ControllerBase
{
    /// <summary>
    /// Validates credentials and returns a JWT access token.
    /// </summary>
    /// <param name="request">Login credentials.</param>
    /// <param name="cancellationToken">Cancellation token for request cancellation.</param>
    /// <returns>JWT token payload for valid credentials.</returns>
    [AllowAnonymous]
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new
            {
                success = false,
                statusCode = StatusCodes.Status400BadRequest,
                message = "Validation failed.",
                traceId = HttpContext.TraceIdentifier,
                errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray())
            });
        }

        var validUsername = configuration["Auth:Username"];
        var validPassword = configuration["Auth:Password"];

        if (string.IsNullOrWhiteSpace(validUsername) || string.IsNullOrWhiteSpace(validPassword))
        {
            return Unauthorized(new
            {
                success = false,
                statusCode = StatusCodes.Status401Unauthorized,
                message = "Authentication configuration is missing.",
                traceId = HttpContext.TraceIdentifier
            });
        }

        if (!string.Equals(request.Username, validUsername, StringComparison.Ordinal) ||
            !string.Equals(request.Password, validPassword, StringComparison.Ordinal))
        {
            return Unauthorized(new
            {
                success = false,
                statusCode = StatusCodes.Status401Unauthorized,
                message = "Invalid username or password.",
                traceId = HttpContext.TraceIdentifier
            });
        }

        var token = await jwtTokenService.GenerateTokenAsync(request.Username, cancellationToken);
        return Ok(token);
    }
}
