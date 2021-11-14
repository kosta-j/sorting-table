const BASE_URL = 'https://swapi.dev/api/';

const axios = require('axios');

class swapiService {
  constructor() {
    this.page = 1;
    this.totalPages = 1;
  }

  async getCharacters() {
    const url = `${BASE_URL}people`;
    try {
      const { data } = await axios.get(url);
      this.totalPages = data.count;
      return data;
    } catch (error) {
      console.error(error);
    }
  }
}
const apiService = new swapiService();
export default apiService;
