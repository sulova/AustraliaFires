var Australia = ee.FeatureCollection("USDOS/LSIB/2013").filterMetadata("cc","equals","AS")
Map.addLayer(Australia);
Map.centerObject(Australia, 4);

// Daily total precipitation sums
var CHIRPS = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
    .filter(ee.Filter.date('2019-09-01','2020-02-29'));
var CHIRPS_AUS = CHIRPS.map(function(Landsat) { return Landsat.clip(Australia); });

var monchart=ui.Chart.image.series(CHIRPS_AUS, Australia, ee.Reducer.mean())
  .setOptions({
    title: "Daily Percipitation for Australia",
    hAxis: {title: 'Date'},
    vAxis: {title: 'Mean Precipitation  (mm/day)'},
    pointSize: 3});
//print(monchart);

var visPer = {min: 0, max:30, palette: ['f4f4f4', '6983aa','00bcd4','0000FF']};
var CHIRPS_AUS_date = CHIRPS_AUS.filter(ee.Filter.date('2020-01-01','2020-02-29')).sum();
Map.addLayer(CHIRPS_AUS_date, visPer,'Precipitation Jan-Feb');

var CHIRPS_AUS_date = CHIRPS_AUS.filter(ee.Filter.date('2019-09-01','2019-12-31')).sum();
Map.addLayer(CHIRPS_AUS_date, visPer,'Precipitation Sep-Dec');

var CHIRPS_AUS_date = CHIRPS_AUS.filter(ee.Filter.date('2020-01-01','2020-01-31')).sum();
Map.addLayer(CHIRPS_AUS_date, visPer,'Precipitation Jan');

var CHIRPS_AUS_date = CHIRPS_AUS.filter(ee.Filter.date('2020-02-01','2020-02-29')).sum();
Map.addLayer(CHIRPS_AUS_date, visPer,'Precipitation Feb');

//____________FIRMS_______________________________________

var dataset_2 = ee.ImageCollection('FIRMS').select('T21').filterDate('2020-02-01','2020-02-29');
var FIRMS_AUS = dataset_2.map(function(firms) { return firms.clip(Australia); });
var FIRMS_AUS_Total = FIRMS_AUS.count();
var visTp = {min: 1, max:5, palette: ['ff1e56']};
Map.addLayer(FIRMS_AUS_Total, visTp,'Total fire Jan-Feb',0);


//_________________LEGEND_____________________________________________
var legend = ui.Panel({style: {position: 'middle-right',padding: '8px 10px'}});
var legendTitle = ui.Label({value: 'Precipitation (mm/day)',style: {fontWeight: 'bold',fontSize: '15px',margin: '5 0 9px 0',padding: '10'}});
legend.add(legendTitle);
var lon = ee.Image.pixelLonLat().select('latitude');
var gradient = lon.multiply((visPer.max-visPer.min)/100.0).add(visPer.min);
var legendImage = gradient.visualize(visPer);
var panel = ui.Panel({widgets: [ui.Label(visPer['max'])],});
legend.add(panel);
var thumbnail = ui.Thumbnail({image: legendImage,params: {bbox:'0,0,10,90', dimensions:'20x70'},style: {padding: '1px', position: 'bottom-right'}});
legend.add(thumbnail);
var panel = ui.Panel({widgets: [ui.Label(visPer['min'])],});legend.add(panel);Map.add(legend);

//_________Basemap
var mapStyle = [
  {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
  {featureType: 'administrative',elementType: 'geometry.stroke',stylers: [{color: '#c9b2a6'}] },
  {featureType: 'administrative.land_parcel',elementType: 'geometry.stroke',stylers: [{color: '#dcd2be'}]},
  {featureType: 'administrative.land_parcel',elementType: 'labels.text.fill',stylers: [{color: '#ae9e90'}]},
  {featureType: 'administrative.land_parcel',  elementType: 'labels.text.stroke',stylers: [{color: '#000040'}, {visibility: 'simplified'}]}, 
  {featureType: 'administrative.neighborhood',elementType: 'labels.text.fill',stylers: [{color: '#408080'}]},
  {featureType: 'landscape.man_made',elementType: 'geometry.fill',stylers: [{color: '#800040'}]}, 
  {featureType: 'landscape.natural',  elementType: 'geometry',stylers: [{color: 'blue'}]},
  {featureType: 'landscape.natural',elementType: 'geometry.fill',stylers: [{color: 'blue'}]},
  {featureType: 'landscape.natural.terrain',elementType: 'geometry.fill', stylers: [{color: 'blue'}]},
  {featureType: 'road',elementType: 'geometry',stylers: [{color: '#f5f1e6'}]},
  {featureType: 'road.highway',elementType: 'geometry',stylers: [{color: '#f8c967'}]},
  {featureType: 'road.highway',elementType: 'geometry.stroke',stylers: [{color: '#e9bc62'}]},
  {featureType: 'road.local',elementType: 'labels.text.fill',stylers: [{color: '#806b63'}]},
  {featureType: 'water', elementType: 'geometry.fill',stylers: [{color: '#b9d3c2'}] }, 
  {featureType: 'water',elementType: 'labels.text.fill',stylers: [{color: 'blue'}]}];

Map.setOptions('mapStyle', {mapStyle: mapStyle});


