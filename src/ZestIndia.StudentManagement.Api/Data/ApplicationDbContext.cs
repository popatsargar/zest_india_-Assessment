using Microsoft.EntityFrameworkCore;
using ZestIndia.StudentManagement.Api.Models.Entities;

namespace ZestIndia.StudentManagement.Api.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Student> Students => Set<Student>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Student>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(100);
            entity.Property(x => x.Email).IsRequired().HasMaxLength(150);
            entity.HasIndex(x => x.Email).IsUnique();
            entity.Property(x => x.Course).IsRequired().HasMaxLength(100);
            entity.Property(x => x.CreatedDate).HasDefaultValueSql("GETUTCDATE()");
        });

        base.OnModelCreating(modelBuilder);
    }
}
