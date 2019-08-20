using Microsoft.AspNetCore.SignalR;

namespace Server.Communication
{
    public class CommunicationHub : Hub
    {
        public void SendToAll(string payload)
        {
            Clients.All.SendAsync("sendToAll", payload);
        }
    }
}
