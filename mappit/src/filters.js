import $ from 'jquery';
import uniqueByKey from './lib/unique';

const REMOVE_FILTER_VAL = '!@@@!';
const REMOVE_FILTER_TEXT = ' any ';

const filters = [
  // key, value
  // ['it_owner', 'IT owner'],
  // ['hr_owner', 'HR owner'],
  ['sales_segment', 'SALES SEGMENT'],
  ['industry', 'INDUSTRY'],
  ['site', 'SITE'],
  ['product', 'PRODUCT'],
  ['account_owner', 'ACCOUNT OWNER'],
  ['account_manager', 'ACCOUNT MANAGER'],
  ['director', 'DIRECTOR'],
];

function makeSelect(key, label, values) {
  let $select = $('<select class="form-control"></select>').data('key', key);
  // let $label = $('<label></label>').text(label);
  let option = $('<option></option>')
    .text(label)
    .attr('value', REMOVE_FILTER_VAL);
  $select.append(option);

  values.forEach((v) => {
    option = $('<option></option').text(v);
    $select.append(option);
  });
  return $('<div class="form-group"></div>')
    // .append($label)
    .append($select);
}

function loadFilters(data, callback) {
  let $container = $('#Filters');
  filters.forEach((filter) => {
    const values = uniqueByKey(data, filter[0]);
    let $select = makeSelect(filter[0], filter[1], values);
    $container.append($select);
  });
  $('#Filters select').on('change', () => {
    callback(getFilters());
  })
}

function getFilters() {
  let filters = [];
  $('#Filters select').each(function() { // need function beause of `this`!
    let $this = $(this);
    let val = $this.val();
    let key = $this.data('key');
    if (val !== REMOVE_FILTER_VAL) {
      filters.push({
        key: key, value: val
      });
    }
  });
  return filters;
}

export default loadFilters;
