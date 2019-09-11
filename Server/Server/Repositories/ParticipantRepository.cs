using System.Collections.Generic;
using System.Linq;
using Server.Models;

namespace Server.Repositories
{
    public class ParticipantRepository : IParticipantRepository
    {
        private List<Participant> participants;

        public ParticipantRepository()
        {
            participants = new List<Participant>();
        }

        public IEnumerable<Participant> GetAll()
        {
            return participants;
        }

        public Participant GetById(string userId)
        {
            return participants.SingleOrDefault(p => p.UserId == userId);
        }

        public void Create(Participant participant)
        {
            if (GetById(participant.UserId) == null)
            {
                participants.Add(participant);
            }
        }

        public void Update(Participant participant)
        {
            var oldParticipant = GetById(participant.UserId);
            var index = participants.IndexOf(oldParticipant);

            if (index != -1)
            {
                participants[index] = participant;
            }
        }

        public bool Remove(Participant participant)
        {
            return participants.Remove(participant);
        }

        public Participant Remove(string userId)
        {
            var participantToRemove = participants.SingleOrDefault(p => p.UserId == userId);

            if (participantToRemove == null)
            {
                return null;
            }

            participants.Remove(participantToRemove);

            return participantToRemove;
        }
    }
}
