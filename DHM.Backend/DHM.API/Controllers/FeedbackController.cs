using System.Threading.Tasks;
using DHM.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace DHM.API.Controllers
{
    public class FeedbackRequest
    {
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
    }

    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public FeedbackController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitFeedback([FromBody] FeedbackRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest("Message cannot be empty.");
            }

            var subject = $"[DHM Feedback] {request.Subject}";
            var body = $@"
                <h3>New Feedback Received</h3>
                <p><strong>From:</strong> {request.UserName} ({request.UserEmail})</p>
                <p><strong>Subject:</strong> {request.Subject}</p>
                <hr />
                <p>{request.Message}</p>
            ";

            // Send to official DHM email
            var targetEmail = "dhm.clothing.official@gmail.com";

            await _emailService.SendEmailAsync(targetEmail, subject, body);

            return Ok(new { message = "Feedback sent successfully." });
        }
    }
}
