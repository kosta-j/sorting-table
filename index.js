const BASE_URL = 'https://swapi.dev/api/';
const axios = require('axios');

import Alpine from 'alpinejs';

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

        // save total characters count
        this.setTotalCharacters(firstFetch.count);

        // save first render data
        await this.updateHomeworld(firstFetch.results);

        if (firstFetch.count <= 10) {
          this.setIsLoading(false);
          return;
        }

        // count total pages based on first fetch
        const totalPages = Math.ceil(
          this.totalCharacters / this.charactersPerPage,
        );

        // fetch and save all rest data
        for (let i = 2; i <= totalPages; i++) {
          this.setPage(i);
          const { results } = await this.getCharacters();
          await this.updateHomeworld(results);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.setIsLoading(false);
      }
    },

    getCharacters: async function () {
      const url = `${BASE_URL}people/?page=${this.page}`;
      try {
        const { data } = await axios.get(url);
        const { count, results } = data;
        return { count, results };
      } catch (error) {
        console.error(error);
      }
    },

    updateHomeworld: async function (array) {
      try {
        array.map(async item => {
          const planet = await axios.get(item.homeworld);
          item.homeworld = planet.data.name;
          await this.appendData(item);
        });
      } catch (error) {
        console.log(error);
      }
    },

    appendData: function (fetchedData) {
      this.data.push(fetchedData);
    },
    setPage: function (newPage) {
      this.page = newPage;
    },
    setIsLoading: function (value) {
      this.isLoading = value;
    },
    setTotalCharacters: function (value) {
      this.totalCharacters = value;
    },
    setSortOrderDesc: function (value) {
      this.sortOrderDesc = value;
    },
    toggleSortOrderDesc: function () {
      if (this.sortOrderDesc) {
      }
      this.sortOrderDesc = !this.sortOrderDesc;
    },
    setSortBy: function (value) {
      this.sortBy = value;
    },

    compareValues: function (key, descending = this.sortOrderDesc) {
      // avoid sorting while fetching
      if (this.isLoading) {
        return;
      }

      // sort order set up
      if (key !== this.sortBy) {
        this.setSortOrderDesc(false);
        this.setSortBy(key);
      } else if (key === this.sortBy) {
        this.toggleSortOrderDesc();
      }

      return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          return 0;
        }
        let varA;
        let varB;

        if (!isNaN(Number(a[key])) || !isNaN(Number(b[key]))) {
          varA = isNaN(Number(a[key])) ? a[key].length : Number(a[key]);
          varB = isNaN(Number(b[key])) ? b[key].length : Number(b[key]);
        } else {
          varA =
            typeof a[key] === 'string' ? a[key].toLowerCase() : a[key].length;
          varB =
            typeof b[key] === 'string' ? b[key].toLowerCase() : b[key].length;
        }

        console.log('varA:', varA);
        console.log('varB:', varB);

        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return descending ? comparison * -1 : comparison;
      };
    },
  };
};

Alpine.start();
