using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Server.Repositories;
using Server.Security;
using Server.Services;

namespace Server.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IPrivateKeyGenerator privateKeyGenerator;

        public AuthController(IPrivateKeyGenerator privateKeyGenerator)
        {
            this.privateKeyGenerator = privateKeyGenerator;
        }

        [HttpGet]
        public IActionResult Get(string userId, string userName)
        {
            var signingKey = Encoding.ASCII.GetBytes(privateKeyGenerator.PrivateKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = null,
                Audience = null,
                IssuedAt = DateTime.UtcNow,
                NotBefore = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddMinutes(60),
                Subject = new ClaimsIdentity(new List<Claim> {
                    new Claim(ClaimTypes.NameIdentifier, userId),
                    new Claim(ClaimTypes.Name, userName)
                }),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(signingKey), SecurityAlgorithms.HmacSha256Signature)
            };
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = jwtTokenHandler.CreateJwtSecurityToken(tokenDescriptor);
            var token = jwtTokenHandler.WriteToken(jwtToken);
            return Ok(token);
        }

        [HttpGet("appinfo")] // TODO: Delete this
        public async Task<IActionResult> GetAppInfo()
        {
            return Ok(await new JiraService(null, null).GetCustomFieldIdByNameAsync("Story Points"));
        }
    }
}
