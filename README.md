# PlanningPokR

Planning Poker web app with SignalR

## Backlog / Ideas

🚫Blocked - ✅Done - 🔢Priorities

### Tech Dept

* 3️⃣ "The default HSTS value is 30 days. You may want to change this for production scenarios, see <https://aka.ms/aspnetcore-hsts.>"
* 3️⃣ Get rid of explicit allowed origin definition.
* 1️⃣ There should be at least some tests :D
* 2️⃣ Cleanup files and configurations from CI/CD work (pipeline.yaml file, output dir, .circleci, ...)

### Technical Enhancements

* 1️⃣ Reconnect at connection loss (See Authentication / Authorization) 🚫1️⃣2️⃣3️⃣
* 2️⃣ Setup Logging (local and in cloud)
* ✅ Setup Azure infrastructure
* 3️⃣ Figure out http/https. Only use https if possible
* 2️⃣ Basic error handling in frontend
* 3️⃣ Take some time to create a design that is not ugly as hell
* 3️⃣ Only clients can connect to the backend SignalR

### Base Feature Set

* Rooms
  * ✅ Participants can join a room
  * ✅ All participants in room are displayed in real time
  * 2️⃣ There are different rooms available
  * 2️⃣ Subcomponents use a sub-router
* Backlog
  * 2️⃣ Add/Remove items
  * 1️⃣ Select items when voting
  * 🚫 Display additional item information when voting
* Voting
  * 1️⃣ Participants can vote on fibonacci size
  * 🚫 In the participants list it is visible if someone already voted or not
  * 🚫 Result can be displayed
* Authentication / Authorization
  * 1️⃣ Use local storage to assign groups and other properties to a user

### Extended Feature Set

* Rooms
  * 🚫 Creation/Deletion of rooms
  * 🚫 There is a moderator role that is claimed by the first person entering the room and can be claimed by every user
* Jira Integration
  * 🚫 Replace/Extend backlog feature with Jira integration
  * 🚫 Write back story points to Jira
* Voting
  * 🚫 Voting options are configurable
  * 🚫 The result is also visible in the participants list
  * 🚫 The result is nicely displayed
* Authentication / Authorization
  * 3️⃣ Use an suitable identity provider (Azure AD or Google)

### DevOps

* ✅ On every integration in master branch, all builds and tests are triggered
* ✅ On demand deployment to Azure
* 1️⃣ On every successful build, the application is automatically deployed
* 2️⃣ NPM packages are used from cache
* 2️⃣ NuGet packages are used from cache
* 2️⃣ Find some nice way to integrate configurations in the application
* 3️⃣ Split app into dev and production environment
* 🚫 Secrets (Jira credentials) are injected from outside and are not in the Repo :D

### Bugs

* 3️⃣ HTTP does not work in Azure
