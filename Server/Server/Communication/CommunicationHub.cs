using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Server.Models;
using Server.Repositories;

namespace Server.Communication
{
    public class CommunicationHub : Hub
    {
        private IParticipantRepository participantRepository;

        public CommunicationHub(IParticipantRepository participantRepository)
        {
            this.participantRepository = participantRepository;
        }

        [HubMethodName("createParticipant")]
        public async Task CreateParticipant(string name)
        {
            var participant = new Participant
            {
                ConnectionId = Context.ConnectionId,
                Name = name,
                Vote = null,
            };
            participantRepository.Create(participant);

            await SendParticipantsStateUpdate();
        }

        [HubMethodName("leaveRoom")]
        public async Task LeaveRoom()
        {
            participantRepository.Remove(Context.ConnectionId);

            await SendParticipantsStateUpdate();
        }

        [HubMethodName("selectValue")]
        public async Task SelectValue(int value)
        {
            // TODO: Nullcheck
            var participant = participantRepository.GetById(Context.ConnectionId);

            participant.Vote = value;
            participantRepository.Update(participant);

            await SendParticipantsStateUpdate();
        }

        private async Task SendParticipantsStateUpdate()
        {
            var participantsStateUpdate = new ParticipantsStateUpdate
            {
                Participants = participantRepository.GetAll().Select(MapParticipant).ToList()
            };

            await Clients.All.SendAsync("participantsStateUpdate", participantsStateUpdate);
        }

        private ParticipantExternalDto MapParticipant(Participant participant)
        {
            return new ParticipantExternalDto
            {
                ConnectionId = participant.ConnectionId,
                Name = participant.Name,
                HasVoted = participant.Vote.HasValue,
            };
        }
    }
}
