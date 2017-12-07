import $ from 'jquery';
import filter from 'lodash/filter';
import UniqueCounter from './lib/unique-counter';
import currency from './lib/currency';
import pluralize from './lib/pluralize';

import './aggregator.css';

function showAggregatedData(rawData, filters) {
  let data = aggregate(rawData, filters);
  let html = `
  <div class="big">${currency(data.monthly_value)}</div>
  <div>Monthly value</div>
  <div class="container-fluid">
    <div class="row">
      <div class="col-xs-6">
        <div class="big">${data.cities}</div>
        <div>${pluralize(data.countries, 'city', 'cities')}</div>
      </div>
      <div class="col-xs-6">
        <div class="big">${data.countries}</div>
        <div>${pluralize(data.countries, 'country', 'countries')}</div>
      </div>
    </div>
  </div>`;
  // console.log(data);
  $('#Stats').html(html);
}

function aggregate(data, filters) {
  let filteredData = filters.length ?
    filter(data, filtersAsObject(filters)) :
    data;
  let total = 0;
  let cities = new UniqueCounter();
  let countries = new UniqueCounter();
  filteredData.forEach((item) => {
    total += item.monthly_value || 0;
    cities.add(`${item.location.city} ${item.location.state} ${item.location.country}`);
    countries.add(item.location.country);
  });
  return {
    monthly_value: total,
    cities: cities.count(),
    countries: countries.count(),
  };
}

function filtersAsObject(filters) {
  let obj = {};
  filters.forEach((filter) => {
    obj[filter.key] = filter.value;
  });
  return obj;
}


export default showAggregatedData;
