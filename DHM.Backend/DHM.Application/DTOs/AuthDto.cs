using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace DHM.Application.DTOs
{
    public class RegisterDto
    {
        private string _firstName = string.Empty;
        
        [Required]
        [RegularExpression(@"^[\p{L}\p{M}' \.\-]+$", ErrorMessage = "First name contains invalid characters.")]
        [MaxLength(50)]
        public string FirstName { get => _firstName; set => _firstName = value?.Trim() ?? string.Empty; }

        private string _lastName = string.Empty;

        [Required]
        [RegularExpression(@"^[\p{L}\p{M}' \.\-]+$", ErrorMessage = "Last name contains invalid characters.")]
        [MaxLength(50)]
        public string LastName { get => _lastName; set => _lastName = value?.Trim() ?? string.Empty; }

        private string _email = string.Empty;

        [Required]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        [MaxLength(100)]
        public string Email { get => _email; set => _email = value?.Trim() ?? string.Empty; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        private string _email = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get => _email; set => _email = value?.Trim() ?? string.Empty; }

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public IList<string> Roles { get; set; } = new List<string>();
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public UserDto User { get; set; } = default!;
    }

    public class VerifyDto
    {
        public string Email { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
    }

    public class RegisterResponseDto
    {
        public string Message { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
