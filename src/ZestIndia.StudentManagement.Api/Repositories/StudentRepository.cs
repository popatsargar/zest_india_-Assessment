using Microsoft.EntityFrameworkCore;
using ZestIndia.StudentManagement.Api.Data;
using ZestIndia.StudentManagement.Api.Models.Entities;

namespace ZestIndia.StudentManagement.Api.Repositories;

public class StudentRepository(ApplicationDbContext context) : IStudentRepository
{
    public async Task<List<Student>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await context.Students
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<Student?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await context.Students.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<Student> AddAsync(Student student, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(student);

        await context.Students.AddAsync(student, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return student;
    }

    public async Task UpdateAsync(Student student, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(student);

        context.Students.Update(student);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Student student, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(student);

        context.Students.Remove(student);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> EmailExistsAsync(string email, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        var query = context.Students.AsQueryable();

        if (excludeId.HasValue)
        {
            query = query.Where(x => x.Id != excludeId.Value);
        }

        return await query.AnyAsync(x => x.Email == email, cancellationToken);
    }
}
