using ZestIndia.StudentManagement.Api.Models.Dtos;
using ZestIndia.StudentManagement.Api.Models.Entities;
using ZestIndia.StudentManagement.Api.Repositories;

namespace ZestIndia.StudentManagement.Api.Services;

public class StudentService(IStudentRepository studentRepository) : IStudentService
{
    public async Task<IReadOnlyList<StudentResponseDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var students = await studentRepository.GetAllAsync(cancellationToken);
        return students.Select(MapToResponse).ToList();
    }

    public async Task<StudentResponseDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var student = await studentRepository.GetByIdAsync(id, cancellationToken);
        if (student is null)
        {
            throw new KeyNotFoundException($"Student with id {id} was not found.");
        }

        return MapToResponse(student);
    }

    public async Task<StudentResponseDto> CreateAsync(StudentCreateDto request, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var emailExists = await studentRepository.EmailExistsAsync(normalizedEmail, cancellationToken: cancellationToken);

        if (emailExists)
        {
            throw new InvalidOperationException("A student with this email already exists.");
        }

        var student = new Student
        {
            Name = request.Name.Trim(),
            Email = normalizedEmail,
            Age = request.Age,
            Course = request.Course.Trim(),
            CreatedDate = DateTime.UtcNow
        };

        var created = await studentRepository.AddAsync(student, cancellationToken);
        return MapToResponse(created);
    }

    public async Task<StudentResponseDto> UpdateAsync(int id, StudentUpdateDto request, CancellationToken cancellationToken = default)
    {
        var existing = await studentRepository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Student with id {id} was not found.");
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var emailExists = await studentRepository.EmailExistsAsync(normalizedEmail, id, cancellationToken);

        if (emailExists)
        {
            throw new InvalidOperationException("A student with this email already exists.");
        }

        existing.Name = request.Name.Trim();
        existing.Email = normalizedEmail;
        existing.Age = request.Age;
        existing.Course = request.Course.Trim();

        await studentRepository.UpdateAsync(existing, cancellationToken);
        return MapToResponse(existing);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var existing = await studentRepository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Student with id {id} was not found.");
        }

        await studentRepository.DeleteAsync(existing, cancellationToken);
    }

    private static StudentResponseDto MapToResponse(Student student)
    {
        return new StudentResponseDto
        {
            Id = student.Id,
            Name = student.Name,
            Email = student.Email,
            Age = student.Age,
            Course = student.Course,
            CreatedDate = student.CreatedDate
        };
    }
}
