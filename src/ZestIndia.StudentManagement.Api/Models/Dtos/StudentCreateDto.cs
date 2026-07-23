using System.ComponentModel.DataAnnotations;

namespace ZestIndia.StudentManagement.Api.Models.Dtos;

public class StudentCreateDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Range(1, 120)]
    public int Age { get; set; }

    [Required]
    [MaxLength(100)]
    public string Course { get; set; } = string.Empty;
}