using System;

namespace Server.Security
{
    public class Private256BitKeyGenerator : IPrivateKeyGenerator
    {
        public string PrivateKey { get; private set; }

        public Private256BitKeyGenerator()
        {
            PrivateKey = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");
        }
    }
}
