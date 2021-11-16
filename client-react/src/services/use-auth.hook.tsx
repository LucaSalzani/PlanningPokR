import AuthService from './auth.service'

const authService = new AuthService()

const useAuth = () => {
  return authService
}

export default useAuth