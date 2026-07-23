using ZestIndia.StudentManagement.Api.Models.Dtos;

namespace ZestIndia.StudentManagement.Api.Services;

public interface IStudentService
{
    Task<IReadOnlyList<StudentResponseDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<StudentResponseDto> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<StudentResponseDto> CreateAsync(StudentCreateDto request, CancellationToken cancellationToken = default);
    Task<StudentResponseDto> UpdateAsync(int id, StudentUpdateDto request, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
}
