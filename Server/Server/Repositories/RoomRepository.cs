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
            rooms = new List<Room>
            {
                new Room {RoomId = "anubis", RoomName = "Anubis", AreVotesRevealed = false, Stories = new List<string>()},
                new Room {RoomId = "geb", RoomName = "Geb", AreVotesRevealed = false, Stories = new List<string>()},
                new Room {RoomId = "horus", RoomName = "Horus", AreVotesRevealed = false, Stories = new List<string>()},
                new Room {RoomId = "maat", RoomName = "Maat", AreVotesRevealed = false, Stories = new List<string>()},
                new Room {RoomId = "osiris", RoomName = "Osiris", AreVotesRevealed = false, Stories = new List<string>()},
                new Room {RoomId = "seth", RoomName = "Seth", AreVotesRevealed = false, Stories = new List<string>()},
            };
        }

        public IEnumerable<Room> GetAll()
        {
            throw new System.NotImplementedException();
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