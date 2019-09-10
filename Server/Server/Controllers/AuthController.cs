using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Server.Security;

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
                Issuer = null,              // Not required as no third-party is involved
                Audience = null,            // Not required as no third-party is involved
                IssuedAt = DateTime.UtcNow,
                NotBefore = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddMinutes(60),
                Subject = new ClaimsIdentity(new List<Claim> {
                    new Claim("userid", userId),
                    new Claim("userName", userName)
                }),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(signingKey), SecurityAlgorithms.HmacSha256Signature)
            };
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = jwtTokenHandler.CreateJwtSecurityToken(tokenDescriptor);
            var token = jwtTokenHandler.WriteToken(jwtToken);
            return Ok(token);
        }
    }
}
