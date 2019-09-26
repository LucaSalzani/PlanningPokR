using System;

namespace Server.Security
{
    public class PrivateKeyGenerator256Bit : IPrivateKeyGenerator
    {
        public string PrivateKey { get; private set; }

        public PrivateKeyGenerator256Bit()
        {
            PrivateKey = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");
        }
    }
}
