using System;
using System.Collections.Generic;
using Server.Models;

namespace Server.Repositories
{
    public interface IParticipantRepository
    {
        IEnumerable<Participant> GetAll();

        Participant GetById(string connectionId);

        void Create(Participant participant);

        bool Remove(Participant participant);

        Participant Remove(string connectionId);
    }
}
