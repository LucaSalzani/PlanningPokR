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

        [HubMethodName("revealVotes")]
        public async Task RevealVotes()
        {
            participantRepository.SetAreVotesRevealed(true);

            await SendParticipantsStateUpdate();
        }

        private async Task SendParticipantsStateUpdate()
        {
            var areVotesRevealed = participantRepository.GetAreVotesRevealed();
            var participantsStateUpdate = new ParticipantsStateUpdate
            {
                AreVotesRevealed = areVotesRevealed,
                Participants = participantRepository.GetAll().Select(p => MapParticipant(p, areVotesRevealed)).ToList(),
            };

            await Clients.All.SendAsync("participantsStateUpdate", participantsStateUpdate);
        }

        private ParticipantExternalDto MapParticipant(Participant participant, bool areVotesRevealed)
        {
            return new ParticipantExternalDto
            {
                ConnectionId = participant.ConnectionId,
                Name = participant.Name,
                HasVoted = participant.Vote.HasValue,
                Vote = areVotesRevealed ? participant.Vote : null,
            };
        }
    }
}
