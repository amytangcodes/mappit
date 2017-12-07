import currency from './currency';
var infoWindow;

function buildMarkers(data, map) {
  infoWindow = new window.google.maps.InfoWindow({
    content: ''
  });

  return data.map(function(item, i) {
    var cityCircle = createSizeCircleMarker(item, map);
    window.google.maps.event.addListener(cityCircle, 'click',
    function(e) {
      handleClickEvent(e, cityCircle, map);
    }
  );
    return cityCircle;
  });
}

function handleClickEvent(event, cityCircle, map) {
  var contentString = createContentString(cityCircle.data);
  infoWindow.setPosition(cityCircle.center);
  infoWindow.setContent(contentString);
  infoWindow.open(map, cityCircle);
}

function createContentString(data) {
  return  '<div id="content">'+
            '<div id="siteNotice"></div>'+
            '<h1 id="firstHeading" class="firstHeading">'+ data.account_name + '</h1>'+
            '<div id="bodyContent">'+
            '<p><b>Monthly Value: </b>' + currency(data.monthly_value) +
            '<p><b>Industry: </b>' + data.industry +
            '<p><b>Product: </b>' + data.product +
            '<p><b>Sales Segment: </b>' + data.sales_segment +
            '<p><b>Site: </b>' + data.site +
            '<hr>' +
            '<p><b>Account Owner: </b>' + data.account_owner +
            '<p><b>Account Status: </b>' + data.account_status +
            '<p><b>Status: </b>' + data.status +
            '<p><b>Renewal date: </b>' + data.renewal_date +
            '</p>'+
            '<p><b>Location: </b>' + data.location.city + ', ' + data.location.state +
            '</div>'+
          '</div>';
}

function createSizeCircleMarker(item, map) {
  var stroke = '#FF55FF';
  var fill = '#AA00AA';
  if(item.site === 'HR') {
    stroke = '#55FF55';
    fill = '#00AA00';
  }

  return new window.google.maps.Circle({
    strokeColor: stroke,
    fillColor: fill,
    strokeOpacity: 0.8,
    center: { lat: item['location']['latlng'][0], lng: item['location']['latlng'][1]},
    data: item,
    zIndex: Date.now,
    radius: Math.sqrt(item['monthly_value']) * 500,
    map: map
  })
}

export default buildMarkers;
