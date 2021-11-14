const BASE_URL = 'https://swapi.dev/api/';

import Alpine from 'alpinejs';
import apiService from './apiService';
// import fetchedData from './heroes.json';

window.Alpine = Alpine;

// window.getHeroes = async function () {
//   const response = await apiService.getCharacters();
//   return console.log(response);
// };

window.app = function () {
  return {
    data: [],
    sortBy: '',
    sortAsc: false,
    async getData() {
      this.resetData();
      const { results } = await apiService.getCharacters();
      this.setData(results);
      console.log(this.data);
    },
    resetData() {
      this.data = [];
      console.log('data reset');
      console.log('from reset', JSON.parse(JSON.stringify(this.data)));
    },
    setData(fetchedData) {
      this.data = fetchedData;
    },
    sortByColumn($event) {
      if (this.sortBy === $event.target.innerText) {
        if (this.sortAsc) {
          this.sortBy = '';
          this.sortAsc = false;
        } else {
          this.sortAsc = !this.sortAsc;
        }
      } else {
        this.sortBy = $event.target.innerText;
      }

      let rows = this.getTableRows()
        .sort(
          this.sortCallback(
            Array.from($event.target.parentNode.children).indexOf(
              $event.target,
            ),
          ),
        )
        .forEach(tr => {
          this.$refs.tbody.appendChild(tr);
        });
    },
    getTableRows() {
      return Array.from(this.$refs.tbody.querySelectorAll('tr'));
    },
    getCellValue(row, index) {
      return row.children[index].innerText;
    },
    sortCallback(index) {
      return (a, b) =>
        ((row1, row2) => {
          return row1 !== '' && row2 !== '' && !isNaN(row1) && !isNaN(row2)
            ? row1 - row2
            : row1.toString().localeCompare(row2);
        })(
          this.getCellValue(this.sortAsc ? a : b, index),
          this.getCellValue(this.sortAsc ? b : a, index),
        );
    },
  };
};

Alpine.start();
