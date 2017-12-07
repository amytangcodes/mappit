function filterMarkers(markers, filters) {
  for(var i = 0; i < markers.length; i++) {
    var marker = markers[i]
    marker.setVisible(visibleMarker(marker, filters))
  }
}

function visibleMarker(marker, filters) {
  var showMarker = true
  for(var i = 0; i < filters.length; i++) {
    if (marker['data'][filters[i]['key']] !== filters[i]['value']) {
      showMarker = false
    }
  }
  return showMarker
}



export default filterMarkers
