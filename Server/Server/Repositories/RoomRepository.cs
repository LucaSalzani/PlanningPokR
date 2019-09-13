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
                new Room {RoomId = "anubis", RoomName = "Anubis", AreVotesRevealed = false, Stories = anubisStories, Phase = new Phase {PhaseName = "backlog"}},
                new Room {RoomId = "geb", RoomName = "Geb", AreVotesRevealed = false, Stories = new List<Story>(), Phase = new Phase {PhaseName = "backlog"}},
                new Room {RoomId = "horus", RoomName = "Horus", AreVotesRevealed = false, Stories = horusStories, Phase = new Phase {PhaseName = "backlog"}},
                new Room {RoomId = "maat", RoomName = "Maat", AreVotesRevealed = false, Stories = new List<Story>(), Phase = new Phase {PhaseName = "backlog"}},
                new Room {RoomId = "osiris", RoomName = "Osiris", AreVotesRevealed = false, Stories = new List<Story>(), Phase = new Phase {PhaseName = "backlog"}},
                new Room {RoomId = "seth", RoomName = "Seth", AreVotesRevealed = false, Stories = new List<Story>(), Phase = new Phase {PhaseName = "backlog"}},
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
    }
}