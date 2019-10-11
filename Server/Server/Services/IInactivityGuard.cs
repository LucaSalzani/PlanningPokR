using System.Collections.Generic;
using Server.Models;

namespace Server.Services
{
    public interface IInactivityGuard
    {
        void ReportActivity(string userId);

        List<Participant> RemoveInactiveParticipants();
    }
}
