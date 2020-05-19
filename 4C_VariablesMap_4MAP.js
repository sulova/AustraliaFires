//______Import SHP Australian's States__________________________________________
var Australia = ee.FeatureCollection("users/sulovaandrea/Australia_Polygon");

//______AOI_____________________________________________________________________
var Australia = ee.FeatureCollection("USDOS/LSIB/2013").filterMetadata("cc","equals","AS")
Map.centerObject(Australia,4); 
Map.addLayer(Australia)
// 1 MODIS NDVI 250m
var dataset = ee.ImageCollection('MODIS/006/MOD13Q1')
              .filter(ee.Filter.date('2019-09-01', '2020-02-22'));
var ndvi = dataset.select('NDVI').mean().clip(Australia);;
var ndvi  = ndvi.multiply(0.0001)
var viz = { min: -0, max: 1,palette: ['FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901',
    '66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01', '012E01', '011D01', '011301'],};
Map.addLayer(ndvi, viz, 'NDVI 250 MODIS',1);

// SRTM
var srtm = ee.Image('USGS/SRTMGL1_003');
var srtm = srtm.clip(Australia)
var elevation = srtm.select('elevation');
var slope = ee.Terrain.slope(elevation);
var aspect = ee.Terrain.aspect(elevation);

var viz1 = {min: 150, max: 900, palette:['85a392','565d47','155263','393e46','52616b','c9d6df','eeeeee'],}
Map.addLayer(elevation, viz1, 'SRTM 30m elevation',0);

var viz2 =  {min: 0, max: 2, palette: ['ececec','c1a57b','30475e','222831'],} 
Map.addLayer(slope, viz2, 'SRTM 30m slope',0);

var viz3 = {min: 0, max: 360, palette: ['ffffff','ffa372','512b58','2c003e'],}
Map.addLayer(aspect, viz3, 'SRTM 30m aspect',0);


var palette = viz
var legend = ui.Panel({style: {position: 'bottom-right',padding: '0px'}});
var legendTitle = ui.Label({value: 'NDVI',style: {fontWeight: 'bold',fontSize: '12px',margin: '0px 0px 0px 0px',padding: '0px'}});
legend.add(legendTitle);
var lon = ee.Image.pixelLonLat().select('latitude');
var gradient = lon.multiply((palette.max-palette.min)/100.0).add(palette.min);
var legendImage = gradient.visualize(palette);
var panel = ui.Panel({widgets: [ui.Label(palette['max'])],
            style: {fontSize: '10px',margin: '0px 0px 0px 0px', padding: '0px'}});
legend.add(panel);
var thumbnail = ui.Thumbnail({image: legendImage,params: {bbox:'0,0,10,90', dimensions:'10x60'},
                            style: {margin: '0 0 0 0', padding: '0', }});
legend.add(thumbnail);
var panel = ui.Panel({widgets: [ui.Label(palette['min'])],
            style: {margin: '0 0 0 0', padding: '0px',fontSize: '10px'}});
legend.add(panel);

//__Legend1
var palette1 = viz1
var legend1 = ui.Panel({style: {position: 'middle-right',padding: '0px 0px'}});
var legendTitle = ui.Label({value: 'Elevation',style: {fontWeight: 'bold',fontSize: '12px',margin: '0 0 0 0',padding: '0'}});
legend1.add(legendTitle);
var lon = ee.Image.pixelLonLat().select('latitude');
var gradient = lon.multiply((palette1.max-palette1.min)/100.0).add(palette1.min);
var legendImage = gradient.visualize(palette1);
var panel = ui.Panel({widgets: [ui.Label(palette1['max']+'m')],});
legend1.add(panel);
var thumbnail = ui.Thumbnail({image: legendImage,params: {bbox:'0,0,10,90', dimensions:'10x60'},
                    style: {margin: '0 0 0 0', padding: '0', position: 'middle-left'}});
legend1.add(thumbnail);
var panel = ui.Panel({widgets: [ui.Label(palette1['min']+'m')],});
legend1.add(panel);
//__Legend2
var palette2 = viz2
var legend2 = ui.Panel({style: {position: 'middle-right',padding: '0px 0px'}});
var legendTitle = ui.Label({value: 'Slope',style: {fontWeight: 'bold',fontSize: '12px',margin: '0 0 0 0',padding: '0'}});
legend2.add(legendTitle);
var lon = ee.Image.pixelLonLat().select('latitude');
var gradient = lon.multiply((palette2.max-palette2.min)/100.0).add(palette2.min);
var legendImage = gradient.visualize(palette2);
var panel = ui.Panel({widgets: [ui.Label(palette2['max']+'°')],});
legend2.add(panel);
var thumbnail = ui.Thumbnail({image: legendImage,params: {bbox:'0,0,10,90', dimensions:'10x60'},
                 style: {margin: '0 0 0 0', padding: '0', position: 'middle-left'}});
legend2.add(thumbnail);
var panel = ui.Panel({widgets: [ui.Label(palette2['min']+'°')],});
legend2.add(panel);
//__Legend3
var palette3 = viz3
var legend3 = ui.Panel({style: {position: 'middle-right',padding: '0px 0px'}});
var legendTitle = ui.Label({value: 'Aspect',style: {fontWeight: 'bold',fontSize: '12px',margin: '0 0 0 0',padding: '0'}});
legend3.add(legendTitle);
var lon = ee.Image.pixelLonLat().select('latitude');
var gradient = lon.multiply((palette3.max-palette3.min)/100.0).add(palette3.min);
var legendImage = gradient.visualize(palette3);
var panel = ui.Panel({widgets: [ui.Label(palette3['max']+'°')],});
legend3.add(panel);
var thumbnail = ui.Thumbnail({image: legendImage,params: {bbox:'0,0,10,90', dimensions:'10x60'}, style: {margin: '0 0 0 0', padding: '0', position: 'middle-left'}});
legend3.add(thumbnail);
var panel = ui.Panel({widgets: [ui.Label(palette3['min']+'°')],});
legend3.add(panel);


//________________END-BaseMap____________________________________________________

var image=[ndvi,elevation,slope,aspect];

//var NAMES = ['NDVI','Elevation','Slope','Aspect'];

var VIS_PARAMS = [viz,viz1,viz2,viz3];

var pan = [legend,legend1,legend2,legend3];

// Create a map for each visualization option.
var maps = [];
pan.forEach(function(name, index) {
  var map = ui.Map();
  map.add(ui.Panel(pan[index]))
  //map.add(ui.Label(NAMES[index])); 
  map.addLayer(Australia);
  map.addLayer(image[index], VIS_PARAMS[index]);
  map.setControlVisibility(false);
  maps.push(map);});

var linker = ui.Map.Linker(maps);

maps[0].setControlVisibility({scaleControl: true});
maps[1].setControlVisibility({scaleControl: true});
maps[2].setControlVisibility({scaleControl: true});
maps[3].setControlVisibility({scaleControl: true});


// Create a grid of maps.
var mapGrid = ui.Panel(
  [ ui.Panel([maps[0],maps[1]], null, {stretch: 'both'}),
    ui.Panel([maps[2],maps[3]], null, {stretch: 'both'})
  ],
    ui.Panel.Layout.Flow('horizontal'), {stretch: 'both'});

// Add the maps and title to the ui.root.
ui.root.widgets().reset([mapGrid]);
//ui.root.widgets([legend]);

// Center the maps near Sacramento.
maps[0].centerObject(Australia,3.5);
