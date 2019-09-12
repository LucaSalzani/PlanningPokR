using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Server.Models;
using Server.Repositories;

namespace Server.Communication
{
    [Authorize]
    public class CommunicationHub : Hub
    {
        private IParticipantRepository participantRepository;
        private IRoomRepository roomRepository;

        public CommunicationHub(IParticipantRepository participantRepository, IRoomRepository roomRepository)
        {
            this.participantRepository = participantRepository;
            this.roomRepository = roomRepository;
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();

            var participant = new Participant
            {
                UserId = Context.UserIdentifier,
                UserName = Context.User.Claims.Where(c => c.Type == ClaimTypes.Name).Select(c => c.Value).Single(),
                ConnectionIds = new List<string> { Context.ConnectionId },
                Vote = null,
            };
            participantRepository.Create(participant); // TODO: Add to connectionid if user exists. Or better: Update ConnectionId with each communication to hold the most actual value
        }

        [HubMethodName("enterRoom")]
        public async Task EnterRoom(string roomId)
        {
            var participant = participantRepository.GetById(Context.UserIdentifier);

            if (participant == null)
            {
                return;
            }

            participant.RoomId = roomId;
            participantRepository.Update(participant);
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            await SendParticipantsStateUpdate(roomId);
            await SendNavigationUpdate(roomId);
        }

        [HubMethodName("leaveRoom")]
        public async Task LeaveRoom()
        {
            var participant = participantRepository.GetById(Context.UserIdentifier);

            if (participant == null)
            {
                return;
            }

            var roomId = participant.RoomId;
            participant.RoomId = null;
            participantRepository.Update(participant);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);

            await SendParticipantsStateUpdate(roomId);
        }

        [HubMethodName("selectValue")]
        public async Task SelectValue(int value, string roomId)
        {
            // TODO: Nullcheck
            var participant = participantRepository.GetById(Context.UserIdentifier);

            participant.Vote = value;
            participantRepository.Update(participant);

            await SendParticipantsStateUpdate(roomId);
        }

        [HubMethodName("revealVotes")]
        public async Task RevealVotes(string roomId)
        {
            var room = roomRepository.Get(roomId);
            room.AreVotesRevealed = true;
            roomRepository.Update(room);

            await SendParticipantsStateUpdate(roomId);
        }

        [HubMethodName("resetVotes")]
        public async Task ResetVotes(string roomId)
        {
            var room = roomRepository.Get(roomId);
            room.AreVotesRevealed = false;
            roomRepository.Update(room);

            var participants = participantRepository.GetAll().Where(p => p.RoomId == roomId).ToList();
            participants.ForEach(p =>
            {
                p.Vote = null;
                participantRepository.Update(p);
            });

            await SendParticipantsStateUpdate(roomId);
        }

        [HubMethodName("navigate")]
        public async Task Navigate(string roomId, string phase, string storyId)
        {
            var room = roomRepository.Get(roomId);
            room.Phase.PhaseName = phase;
            room.Phase.StoryId = storyId;
            roomRepository.Update(room);

            await SendNavigationUpdate(roomId);
        }

        private async Task SendParticipantsStateUpdate(string roomId)
        {
            var areVotesRevealed = roomRepository.Get(roomId).AreVotesRevealed;
            var participantsStateUpdate = new ParticipantsStateUpdate
            {
                AreVotesRevealed = areVotesRevealed,
                Participants = participantRepository.GetAll().Where(p => p.RoomId == roomId).Select(p => MapParticipant(p, areVotesRevealed)).ToList(),
            };

            await Clients.Group(roomId).SendAsync("participantsStateUpdate", participantsStateUpdate);
        }

        private async Task SendNavigationUpdate(string roomId)
        {
            var room = roomRepository.Get(roomId);
            var navigationStateUpdate = new NavigationStateUpdate
            {
                Phase = room.Phase.PhaseName,
                StoryId = room.Phase.StoryId,
            };

            await Clients.Group(roomId).SendAsync("navigationUpdate", navigationStateUpdate);
        }

        private ParticipantExternalDto MapParticipant(Participant participant, bool areVotesRevealed)
        {
            return new ParticipantExternalDto
            {
                UserId = participant.UserId,
                Name = participant.UserName,
                HasVoted = participant.Vote.HasValue,
                Vote = areVotesRevealed ? participant.Vote : null,
            };
        }
    }
}
