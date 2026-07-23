using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZestIndia.StudentManagement.Api.Models.Dtos;
using ZestIndia.StudentManagement.Api.Services;

namespace ZestIndia.StudentManagement.Api.Controllers;

/// <summary>
/// Provides CRUD endpoints for managing students.
/// </summary>
[ApiController]
[Authorize]
[Route("api/students")]
public class StudentController(IStudentService studentService) : ControllerBase
{
    /// <summary>
    /// Gets all students.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token for request cancellation.</param>
    /// <returns>A list of students.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(ApiSuccessResponse<IReadOnlyList<StudentResponseDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiSuccessResponse<IReadOnlyList<StudentResponseDto>>>> GetAll(CancellationToken cancellationToken)
    {
        var students = await studentService.GetAllAsync(cancellationToken);
        return Ok(ApiSuccessResponse<IReadOnlyList<StudentResponseDto>>.Create(students, "Students fetched successfully."));
    }

    /// <summary>
    /// Gets a student by id.
    /// </summary>
    /// <param name="id">Student id.</param>
    /// <param name="cancellationToken">Cancellation token for request cancellation.</param>
    /// <returns>The matching student.</returns>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiSuccessResponse<StudentResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiSuccessResponse<StudentResponseDto>>> GetById(int id, CancellationToken cancellationToken)
    {
        if (id <= 0)
        {
            return BadRequest(ApiErrorResponse.Create("The id must be greater than zero."));
        }

        var student = await studentService.GetByIdAsync(id, cancellationToken);
        return Ok(ApiSuccessResponse<StudentResponseDto>.Create(student, "Student fetched successfully."));
    }

    /// <summary>
    /// Creates a new student.
    /// </summary>
    /// <param name="request">Student payload.</param>
    /// <param name="cancellationToken">Cancellation token for request cancellation.</param>
    /// <returns>The created student.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(ApiSuccessResponse<StudentResponseDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiSuccessResponse<StudentResponseDto>>> Create([FromBody] StudentCreateDto request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ApiErrorResponse.Create("Validation failed.", GetModelErrors()));
        }

        var created = await studentService.CreateAsync(request, cancellationToken);
        var response = ApiSuccessResponse<StudentResponseDto>.Create(created, "Student created successfully.");
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, response);
    }

    /// <summary>
    /// Updates an existing student.
    /// </summary>
    /// <param name="id">Student id.</param>
    /// <param name="request">Updated student payload.</param>
    /// <param name="cancellationToken">Cancellation token for request cancellation.</param>
    /// <returns>The updated student.</returns>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiSuccessResponse<StudentResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiSuccessResponse<StudentResponseDto>>> Update(int id, [FromBody] StudentUpdateDto request, CancellationToken cancellationToken)
    {
        if (id <= 0)
        {
            return BadRequest(ApiErrorResponse.Create("The id must be greater than zero."));
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ApiErrorResponse.Create("Validation failed.", GetModelErrors()));
        }

        var updated = await studentService.UpdateAsync(id, request, cancellationToken);
        return Ok(ApiSuccessResponse<StudentResponseDto>.Create(updated, "Student updated successfully."));
    }

    /// <summary>
    /// Deletes a student by id.
    /// </summary>
    /// <param name="id">Student id.</param>
    /// <param name="cancellationToken">Cancellation token for request cancellation.</param>
    /// <returns>No content when deletion succeeds.</returns>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        if (id <= 0)
        {
            return BadRequest(ApiErrorResponse.Create("The id must be greater than zero."));
        }

        await studentService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }

    private Dictionary<string, string[]> GetModelErrors()
    {
        return ModelState
            .Where(x => x.Value?.Errors.Count > 0)
            .ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value!.Errors.Select(err => string.IsNullOrWhiteSpace(err.ErrorMessage) ? "Invalid value." : err.ErrorMessage).ToArray());
    }

    /// <summary>
    /// Standard success envelope for API responses.
    /// </summary>
    /// <typeparam name="T">The response data type.</typeparam>
    public sealed class ApiSuccessResponse<T>
    {
        public bool Success { get; init; } = true;
        public string Message { get; init; } = string.Empty;
        public T Data { get; init; } = default!;

        public static ApiSuccessResponse<T> Create(T data, string message)
        {
            return new ApiSuccessResponse<T>
            {
                Success = true,
                Message = message,
                Data = data
            };
        }
    }

    /// <summary>
    /// Standard error envelope for API responses.
    /// </summary>
    public sealed class ApiErrorResponse
    {
        public bool Success { get; init; }
        public string Message { get; init; } = string.Empty;
        public Dictionary<string, string[]>? Errors { get; init; }

        public static ApiErrorResponse Create(string message, Dictionary<string, string[]>? errors = null)
        {
            return new ApiErrorResponse
            {
                Success = false,
                Message = message,
                Errors = errors
            };
        }
    }
}