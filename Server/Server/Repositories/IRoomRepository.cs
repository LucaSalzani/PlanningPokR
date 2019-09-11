using System.Collections.Generic;
using Server.Models;

namespace Server.Repositories
{
    public interface IRoomRepository
    {
        IEnumerable<Room> GetAll();

        Room Get(string roomId);

        void Update(Room room);

        // AddStory(), RemoveStory()
    }
}
