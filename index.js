import Alpine from 'alpinejs';
import fetchedData from './heroes.json';

window.Alpine = Alpine;

window.getHeroes = function () {
  return fetchedData.results;
};

Alpine.start();
