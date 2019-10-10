using System.Collections.Generic;
using System.Linq;
using Server.Models;

namespace Server.Repositories
{
    public class RoomRepository : IRoomRepository
    {
        private List<Room> rooms;

        public RoomRepository()
        {
            var anubisStories = new List<Story>()
            {
                new Story {StoryId = "DIAS-1", Title = "Story 1 with a medium title", RoomId = "anubis", AcceptedVote = null},
                new Story {StoryId = "DIAS-2", Title = "Story 2 with a quite big title. why does someone even write such a big title anyways?", RoomId = "anubis", AcceptedVote = null},
                new Story {StoryId = "DIAS-3", Title = "Story 3", RoomId = "anubis", AcceptedVote = null},
            };

            var horusStories = new List<Story>()
            {
                new Story {StoryId = "DIAS-4", Title = "Story 4", RoomId = "horus", AcceptedVote = null},
            };

            rooms = new List<Room>
            {
                CreateInitialRoom("anubis", "Anubis", "Team_Anubis", anubisStories),
                CreateInitialRoom("geb", "Geb", "Team_Geb", new List<Story>()),
                CreateInitialRoom("horus", "Horus", "Team_Horus", horusStories),
                CreateInitialRoom("maat", "Maat", "Team_Maat", new List<Story>()),
                CreateInitialRoom("osiris", "Osiris", "Team_Osiris", new List<Story>()),
                CreateInitialRoom("seth", "Seth", "Team_Seth", new List<Story>()),
            };
        }

        public IEnumerable<Room> GetAll()
        {
            return rooms;
        }

        public Room Get(string roomId)
        {
            return rooms.SingleOrDefault(r => r.RoomId == roomId);
        }

        public void Update(Room room)
        {
            var oldRoom = Get(room.RoomId);
            var index = rooms.IndexOf(oldRoom);

            if (index != -1)
            {
                rooms[index] = room;
            }
        }

        private static Room CreateInitialRoom(string roomId, string roomName, string teamJiraLabel, List<Story> stories)
        {
            return new Room
            {
                RoomId = roomId,
                RoomName = roomName,
                AreVotesRevealed = false,
                Stories = stories,
                Phase = new Phase
                {
                    PhaseName = "backlog"
                },
                RoomSettings = new RoomSettings
                {
                    TeamJiraLabel = teamJiraLabel,
                    VotingOptions = GetVotingOptions()
                }
            };
        }

        private static List<VotingOption> GetVotingOptions()
        {
            return new List<VotingOption>
            {
                new VotingOption { Value = 1, DisplayName = "1", IsActive = true },
                new VotingOption { Value = 2, DisplayName = "2", IsActive = true },
                new VotingOption { Value = 3, DisplayName = "3", IsActive = true },
                new VotingOption { Value = 4, DisplayName = "4", IsActive = false },
                new VotingOption { Value = 5, DisplayName = "5", IsActive = true },
                new VotingOption { Value = 6, DisplayName = "6", IsActive = false },
                new VotingOption { Value = 7, DisplayName = "7", IsActive = false },
                new VotingOption { Value = 8, DisplayName = "8", IsActive = true },
                new VotingOption { Value = 9, DisplayName = "9", IsActive = false },
                new VotingOption { Value = 10, DisplayName = "10", IsActive = false },
                new VotingOption { Value = 13, DisplayName = "13", IsActive = true },
                new VotingOption { Value = 21, DisplayName = "21", IsActive = false },
                new VotingOption { Value = 34, DisplayName = "34", IsActive = false },
                new VotingOption { Value = 55, DisplayName = "55", IsActive = false },
                new VotingOption { Value = 89, DisplayName = "89", IsActive = false },
                new VotingOption { Value = 144, DisplayName = "144", IsActive = false },
                new VotingOption { Value = 233, DisplayName = "233", IsActive = false },
                new VotingOption { Value = 377, DisplayName = "377", IsActive = false },
                new VotingOption { Value = 1000, DisplayName = "XS", IsActive = false },
                new VotingOption { Value = 1001, DisplayName = "S", IsActive = false },
                new VotingOption { Value = 1002, DisplayName = "M", IsActive = false },
                new VotingOption { Value = 1003, DisplayName = "L", IsActive = false },
                new VotingOption { Value = 1004, DisplayName = "XL", IsActive = false },
                new VotingOption { Value = 99999, DisplayName = "?", IsActive = false }
            };
        }
    }
}