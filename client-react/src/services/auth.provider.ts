import axios from "axios";
import jwt_decode from 'jwt-decode';

const API_URL = 'https://localhost:5101/api/auth'

const authProvider = {
  isAuthenticated: false,
  jwt: '',
  signin(userName: string, callback: VoidFunction) {
    axios
      .get(API_URL, { params: { username: userName } })
      .then(response => {
        console.log(response.data)
        if (response.status === 200) {
          localStorage.setItem("jwt", response.data)
          authProvider.jwt = response.data
        }
        authProvider.isAuthenticated = true;
        return response.data
      });
    callback();
  },
  signout(callback: VoidFunction) {
    authProvider.isAuthenticated = false;
    authProvider.jwt = '';
    localStorage.removeItem("jwt")
    callback();
  },
  tryReconnect(callback: (userName: string) => void) {
    const existingJwt = localStorage.getItem("jwt")
    if (!!existingJwt) {
      let decodedToken: any
      try {
        decodedToken = jwt_decode(existingJwt)
      } catch (error) {
        console.error(error)
        return callback('')
      }
      authProvider.isAuthenticated = true
      authProvider.jwt = existingJwt
      callback(decodedToken.unique_name)
    }
  }
};

export { authProvider };