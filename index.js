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
    // sortBy: '',
    // sortAsc: false,

    async getAllCharacters() {
      try {
        const firstFetch = await this.getCharacters();
        this.totalCharacters = firstFetch.count;
        this.setData(firstFetch.results);
        if (firstFetch.count <= 10) {
          return;
        }
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
      }
      console.log(`${this.data.length} characters added to the table`);
    },

    async getCharacters() {
      console.log('getCharacters called');
      const url = `${BASE_URL}people/?page=${this.page}`;
      try {
        const { data } = await axios.get(url);
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    setData(fetchedData) {
      this.data = fetchedData;
    },
    appendData(fetchedData) {
      this.data.push(...fetchedData);
    },
    setPage(newPage) {
      this.page = newPage;
    },

    // async getData() {
    //   this.resetData();
    //   const { results } = await apiService.getAllCharacters();
    //   this.setData(results);
    // },

    // sortByColumn($event) {
    //   if (this.sortBy === $event.target.innerText) {
    //     if (this.sortAsc) {
    //       this.sortBy = '';
    //       this.sortAsc = false;
    //     } else {
    //       this.sortAsc = !this.sortAsc;
    //     }
    //   } else {
    //     this.sortBy = $event.target.innerText;
    //   }

    //   let rows = this.getTableRows()
    //     .sort(
    //       this.sortCallback(
    //         Array.from($event.target.parentNode.children).indexOf(
    //           $event.target,
    //         ),
    //       ),
    //     )
    //     .forEach(tr => {
    //       this.$refs.tbody.appendChild(tr);
    //     });
    // },
    // getTableRows() {
    //   return Array.from(this.$refs.tbody.querySelectorAll('tr'));
    // },
    // getCellValue(row, index) {
    //   return row.children[index].innerText;
    // },
    // sortCallback(index) {
    //   return (a, b) =>
    //     ((row1, row2) => {
    //       return row1 !== '' && row2 !== '' && !isNaN(row1) && !isNaN(row2)
    //         ? row1 - row2
    //         : row1.toString().localeCompare(row2);
    //     })(
    //       this.getCellValue(this.sortAsc ? a : b, index),
    //       this.getCellValue(this.sortAsc ? b : a, index),
    //     );
    // },
  };
};

Alpine.start();
