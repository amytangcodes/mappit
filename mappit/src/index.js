import './index.css';
import data from '../../data/accounts.json';
import MAP_STYLES from './map-style';
import buildMarkers from './lib/markers'
import filterMarkers from './lib/filter'
import loadFilters from './filters';
import showAggregatedData from './aggregator';
import _ from 'lodash'

var markers = [];

function initMap() {
  var data_sorted = _.sortBy(data, 'monthly_value').reverse();


  var toronto = {lat: 43.666, lng: -79.442};
  var map = new window.google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: toronto,
    styles: MAP_STYLES
  });

  markers = buildMarkers(data_sorted, map);
  showAggregatedData(data_sorted, []);

  loadFilters(data_sorted, function(filters){
    filterMarkers(markers, filters);
    showAggregatedData(data_sorted, filters);
  });
}

function waitForGoogle(){
  setTimeout(function(){
    if(window.google){
      initMap();
    }else {
      waitForGoogle();
    }
  }, 500);
}

waitForGoogle();
