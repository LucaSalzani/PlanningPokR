using System;
using System.Collections.Generic;
using System.Linq;
using Server.Models;

namespace Server.Repositories
{
    public class ParticipantRepository : IParticipantRepository
    {
        private List<Participant> participants;
        private bool areVotesRevealed; // TODO: Extract to room

        public ParticipantRepository()
        {
            participants = new List<Participant>();
        }

        public IEnumerable<Participant> GetAll()
        {
            return participants;
        }

        public Participant GetById(string connectionId)
        {
            return participants.SingleOrDefault(p => p.ConnectionId == connectionId);
        }

        public void Create(Participant participant)
        {
            // TODO: Avoid duplicates
            participants.Add(participant);
        }

        public void Update(Participant participant)
        {
            var oldParticipant = GetById(participant.ConnectionId);
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

        public Participant Remove(string connectionId)
        {
            var participantToRemove = participants.SingleOrDefault(p => p.ConnectionId == connectionId);

            if (participantToRemove == null)
            {
                return null;
            }

            participants.Remove(participantToRemove);

            return participantToRemove;
        }

        public void SetAreVotesRevealed(bool value)
        {
            areVotesRevealed = value;
        }

        public bool GetAreVotesRevealed()
        {
            return areVotesRevealed;
        }
    }
}
