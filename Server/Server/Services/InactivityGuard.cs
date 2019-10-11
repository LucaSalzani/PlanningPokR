using System;
using System.Collections.Generic;
using System.Linq;
using Server.Models;
using Server.Repositories;

namespace Server.Services
{
    public class InactivityGuard : IInactivityGuard
    {
        private readonly IParticipantRepository participantRepository;

        public InactivityGuard(IParticipantRepository participantRepository)
        {
            this.participantRepository = participantRepository;
        }

        public void ReportActivity(string userId)
        {
            var participant = participantRepository.GetById(userId);

            if (participant == null)
            {
                return;
            }

            participant.LastActiveTimeStampUtc = DateTime.UtcNow;

            participantRepository.Update(participant);

            RemoveInactiveParticipants();
        }

        public List<Participant> RemoveInactiveParticipants()
        {
            var participants = participantRepository.GetAll();

            var removedParticipants = participants.Where(p => p.LastActiveTimeStampUtc.AddHours(1) <= DateTime.UtcNow).ToList();

            removedParticipants.ForEach(p => participantRepository.Remove(p));

            return removedParticipants;
        }
    }
}