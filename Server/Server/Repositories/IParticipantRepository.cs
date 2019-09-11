using System;
using System.Collections.Generic;
using Server.Models;

namespace Server.Repositories
{
    public interface IParticipantRepository
    {
        IEnumerable<Participant> GetAll();

        Participant GetById(string userId);

        void Create(Participant participant);

        void Update(Participant participant);

        bool Remove(Participant participant);

        Participant Remove(string userId);
    }
}
