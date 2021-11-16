import axios from 'axios';

const API_URL = 'https://localhost:5101/api/auth'

class AuthService {

  userName: string | null = null
  jwt: string | null = null

  login(username: string) {
    return axios
      .get(API_URL, { params: { username: username } })
      .then(response => {
        console.log(response.data)
        if (response.status === 200) {
          localStorage.setItem("jwt", response.data)
          this.jwt = response.data
          this.userName = username
        }

        return response.data
      });
  }

  logout() {
    localStorage.removeItem("jwt")
    this.jwt = null
    this.userName = null
  }

  getJwt() {
    return this.jwt ?? ''
  }
}

export default new AuthService()
