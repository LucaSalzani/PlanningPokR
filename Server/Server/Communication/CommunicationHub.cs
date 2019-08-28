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

        public async Task CreateParticipant(string name)
        {
            var participant = new Participant
            {
                ConnectionId = Context.ConnectionId,
                Name = name
            };
            participantRepository.Create(participant);

            await SendParticipantsStateUpdate();
        }

        public async Task LeaveRoom()
        {
            participantRepository.Remove(Context.ConnectionId);

            await SendParticipantsStateUpdate();
        }

        private async Task SendParticipantsStateUpdate()
        {
            var participantsStateUpdate = new ParticipantsStateUpdate
            {
                Participants = participantRepository.GetAll().ToList()
            };

            await Clients.All.SendAsync("participantsStateUpdate", participantsStateUpdate);
        }
    }
}
