const BASE_URL = 'https://swapi.dev/api/';
const axios = require('axios');

import Alpine from 'alpinejs';
// import apiService from './apiService';

window.Alpine = Alpine;

window.app = function () {
  return {
    data: [],
    page: 1,
    charactersPerPage: 10,
    totalCharacters: 1,
    isLoading: false,
    sortOrderDesc: false,
    sortBy: '',

    getAllCharacters: async function () {
      try {
        this.setIsLoading(true);
        // first 10 items page fetch
        const firstFetch = await this.getCharacters();

        // save data and total characters count
        this.setTotalCharacters(firstFetch.count);
        this.setData(firstFetch.results);

        if (firstFetch.count <= 10) {
          this.setIsLoading(false);
          return;
        }

        // count total pages based on first fetch and fetch and save all rest data
        const totalPages = Math.ceil(
          this.totalCharacters / this.charactersPerPage,
        );
        for (let i = 2; i <= totalPages; i++) {
          this.setPage(i);
          const { results } = await this.getCharacters();
          this.appendData(results);
          //   console.log(`page ${i} appended`);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.setIsLoading(false);
        console.log(`${this.data.length} characters added to the table`);
        console.log(this.data[0]);
      }
    },

    getCharacters: async function () {
      const url = `${BASE_URL}people/?page=${this.page}`;
      try {
        const { data } = await axios.get(url);
        return data;
      } catch (error) {
        console.error(error);
      }
    },

    setData: function (fetchedData) {
      this.data = fetchedData;
    },
    appendData: function (fetchedData) {
      this.data.push(...fetchedData);
    },
    setPage: function (newPage) {
      this.page = newPage;
    },
    setIsLoading: function (value) {
      this.isLoading = value;
      console.log('isLoading:', this.isLoading);
    },
    setTotalCharacters: function (value) {
      this.totalCharacters = value;
    },

    compareValues: function (key, order = this.sortOrderDesc) {
      console.log(key);

      if (this.isLoading) {
        console.log('sort return');
        return;
      }

      return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          console.log(`property ${key} is not found`);
          return 0;
        }

        const varA =
          typeof a[key] === 'string' ? a[key].toLowerCase() : a[key].length;
        const varB =
          typeof b[key] === 'string' ? b[key].toLowerCase() : b[key].length;

        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return order === 'desc' ? comparison * -1 : comparison;
      };
    },
  };
};

Alpine.start();
