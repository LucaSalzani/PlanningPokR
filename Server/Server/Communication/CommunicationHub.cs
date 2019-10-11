using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Server.Models;
using Server.Repositories;
using Server.Services;

namespace Server.Communication
{
    [Authorize]
    public class CommunicationHub : Hub
    {
        private readonly IParticipantRepository participantRepository;
        private readonly IRoomRepository roomRepository;
        private readonly IInactivityGuard inactivityGuard;
        private readonly ILogger logger;

        public CommunicationHub(IParticipantRepository participantRepository, IRoomRepository roomRepository, IInactivityGuard inactivityGuard, ILogger<CommunicationHub> logger)
        {
            this.participantRepository = participantRepository;
            this.roomRepository = roomRepository;
            this.inactivityGuard = inactivityGuard;
            this.logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            UpdateConnectionId();
            await ReportActivity();

            var participant = new Participant
            {
                UserId = Context.UserIdentifier,
                UserName = Context.User.Claims.Where(c => c.Type == ClaimTypes.Name).Select(c => c.Value).Single(),
                ConnectionId = Context.ConnectionId,
                Vote = null,
                IsModerator = false,
            };

            var oldParticipant = participantRepository.GetById(Context.UserIdentifier);

            if (oldParticipant != null)
            {
                logger.LogInformation($"Attempting reconnect: {oldParticipant.UserName}, {oldParticipant.RoomId}");
                if (!string.IsNullOrEmpty(oldParticipant.RoomId))
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, oldParticipant.RoomId);
                    await SendParticipantsStateUpdate(oldParticipant.RoomId);
                    await SendNavigationUpdate(oldParticipant.RoomId);
                    await SendRoomSettingsUpdate(oldParticipant.RoomId);
                    await SendStoryStateUpdate();
                }
            }
            else
            {
                participantRepository.Create(participant);
            }
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
            
            logger.LogDebug(exception, $"Client {Context.UserIdentifier} disconnected");
        }

        [HubMethodName("enterRoom")]
        public async Task EnterRoom(string roomId)
        {
            UpdateConnectionId();
            await ReportActivity();
            var participant = participantRepository.GetById(Context.UserIdentifier);

            if (participant == null)
            {
                return;
            }

            if (!participantRepository.GetAll().Any(p => p.RoomId == roomId))
            {
                participant.IsModerator = true;
            }

            participant.RoomId = roomId;
            participantRepository.Update(participant);
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            await SendParticipantsStateUpdate(roomId);
            await SendNavigationUpdate(roomId);
            await SendRoomSettingsUpdate(roomId);
            await SendStoryStateUpdate();
        }

        [HubMethodName("leaveRoom")]
        public async Task LeaveRoom()
        {
            UpdateConnectionId();
            await ReportActivity();
            var participant = participantRepository.GetById(Context.UserIdentifier);

            if (participant == null)
            {
                return;
            }

            var roomId = participant.RoomId;
            participant.RoomId = null;
            participant.IsModerator = false;
            participantRepository.Update(participant);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);

            var remainingRoomParticipants = participantRepository.GetAll().Where(p => p.RoomId == roomId).ToList();
            if (remainingRoomParticipants.Count() != 0 && remainingRoomParticipants.All(p => !p.IsModerator))
            {
                var newModerator = remainingRoomParticipants.First();
                newModerator.IsModerator = true;
                participantRepository.Update(newModerator);
            }

            await SendParticipantsStateUpdate(roomId);
        }

        [HubMethodName("selectValue")]
        public async Task SelectValue(int value, string roomId)
        {
            UpdateConnectionId();
            await ReportActivity();

            var participant = participantRepository.GetById(Context.UserIdentifier);

            participant.Vote = value;
            participantRepository.Update(participant);

            await SendParticipantsStateUpdate(roomId);
        }

        [HubMethodName("revealVotes")]
        public async Task RevealVotes(string roomId)
        {
            await ReportActivity();
            UpdateConnectionId();
            var room = roomRepository.Get(roomId);
            room.AreVotesRevealed = true;
            roomRepository.Update(room);

            await SendParticipantsStateUpdate(roomId);
        }

        [HubMethodName("resetVotes")]
        public async Task ResetVotes(string roomId)
        {
            await ReportActivity();
            UpdateConnectionId();
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

        [HubMethodName("setAcceptedVote")]
        public async Task SetAcceptedVote(string roomId, string storyId, int acceptedVote)
        {
            await ReportActivity();
            UpdateConnectionId();
            var room = roomRepository.Get(roomId);
            if (room?.Stories.FirstOrDefault(s => s.StoryId == storyId) == null)
            {
                return;
            }
            room.Stories.SingleOrDefault(s => s.StoryId == storyId).AcceptedVote = acceptedVote;

            roomRepository.Update(room);

            await SendStoryStateUpdate();
        }

        [HubMethodName("addStory")]
        public async Task AddStory(string roomId, string storyId, string title)
        {
            await ReportActivity();
            UpdateConnectionId();
            var room = roomRepository.Get(roomId);
            if (room == null || room.Stories.FirstOrDefault(s => s.StoryId == storyId) != null)
            {
                return;
            }

            var story = new Story
            {
                RoomId = roomId,
                StoryId = storyId,
                Title = title,
                AcceptedVote = null,
            };

            room.Stories.Add(story);

            roomRepository.Update(room);

            await SendStoryStateUpdate();
        }

        [HubMethodName("deleteStory")]
        public async Task DeleteStory(string roomId, string storyId)
        {
            await ReportActivity();
            UpdateConnectionId();
            var room = roomRepository.Get(roomId);
            if (room == null || room.Stories.FirstOrDefault(s => s.StoryId == storyId) == null)
            {
                return;
            }

            room.Stories.RemoveAll(s => s.StoryId == storyId);

            roomRepository.Update(room);

            await SendStoryStateUpdate();
        }


        [HubMethodName("navigate")]
        public async Task Navigate(string roomId, string phase, string storyId)
        {
            await ReportActivity();
            UpdateConnectionId();
            var room = roomRepository.Get(roomId);
            room.Phase.PhaseName = phase;
            room.Phase.StoryId = storyId;
            roomRepository.Update(room);

            await SendNavigationUpdate(roomId);
        }

        [HubMethodName("claimModerator")]
        public async Task ClaimModerator(string roomId)
        {
            await ReportActivity();
            UpdateConnectionId();

            var newModerator = participantRepository.GetById(Context.UserIdentifier);
            var oldModerator = participantRepository.GetAll().SingleOrDefault(p => p.RoomId == roomId && p.IsModerator);

            if (oldModerator != null && newModerator != null)
            {
                oldModerator.IsModerator = false;
                participantRepository.Update(oldModerator);
            }

            if (newModerator != null)
            {
                newModerator.IsModerator = true;
                participantRepository.Update(newModerator);
            }

            await SendParticipantsStateUpdate(roomId);
        }


        [HubMethodName("updateRoomSettings")]
        public async Task UpdateRoomSettings(string roomId, RoomSettings roomSettings)
        {
            await ReportActivity();
            UpdateConnectionId();

            var room = roomRepository.Get(roomId);
            room.RoomSettings = roomSettings;
            roomRepository.Update(room);

            await SendRoomSettingsUpdate(roomId);
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

        private async Task SendStoryStateUpdate()
        {
            var stories = roomRepository.GetAll().SelectMany(r => r.Stories);
            var storyStateUpdate = new StoryStateUpdate
            {
                Stories = stories.ToList(),
            };

            await Clients.All.SendAsync("storyStateUpdate", storyStateUpdate);
        }

        private async Task SendRoomSettingsUpdate(string roomId)
        {
            var room = roomRepository.Get(roomId);

            var roomSettingsUpdate = new RoomSettingsUpdate
            {
                TeamJiraLabel = room.RoomSettings.TeamJiraLabel,
                VotingOptions = room.RoomSettings.VotingOptions
            };

            await Clients.Group(roomId).SendAsync("roomSettingsUpdate", roomSettingsUpdate);
        }

        private async Task ReportActivity()
        {
            inactivityGuard.ReportActivity(Context.UserIdentifier);
            var removedParticipants = inactivityGuard.RemoveInactiveParticipants();
            foreach (var removedParticipant in removedParticipants)
            {
                await Groups.RemoveFromGroupAsync(removedParticipant.ConnectionId, removedParticipant.RoomId);
            }
        }

        private void UpdateConnectionId()
        {
            var participant = participantRepository.GetById(Context.UserIdentifier);
            if (participant != null && participant.ConnectionId != Context.ConnectionId)
            {
                participant.ConnectionId = Context.ConnectionId;
                // participant.Vote = null;
                // TODO: Only reset if roomid changed
                participantRepository.Update(participant);
            }
        }

        private ParticipantExternalDto MapParticipant(Participant participant, bool areVotesRevealed)
        {
            return new ParticipantExternalDto
            {
                UserId = participant.UserId,
                Name = participant.UserName,
                HasVoted = participant.Vote.HasValue,
                Vote = areVotesRevealed ? participant.Vote : null,
                IsModerator = participant.IsModerator,
            };
        }
    }
}
