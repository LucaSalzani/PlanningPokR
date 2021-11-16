import ConnectionHubService from "./connection-hub.service"

const connectionHubService = new ConnectionHubService()

const useHubConnection = () => {
  return connectionHubService
}

export default useHubConnection