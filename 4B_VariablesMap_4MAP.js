//______Import SHP Australian's States__________________________________________
var Australia = ee.FeatureCollection("users/sulovaandrea/Australia_Polygon");

//______AOI_____________________________________________________________________
var Australia = ee.FeatureCollection("USDOS/LSIB/2013").filterMetadata("cc","equals","AS")
Map.centerObject(Australia,4); 
Map.addLayer(Australia)


// 1 Land Cover 100m
// COPERNICUS LAND COVER forest_type Class Table: 
//https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_Landcover_100m_Proba-V_Global#bands
var LandCover =ee.ImageCollection("COPERNICUS/Landcover/100m/Proba-V/Global")
var LandCover = LandCover.select('discrete_classification').mosaic().clip(Australia);
var Classes ='<RasterSymbolizer>'+
      '<ColorMap type = "intervals" extended="false" >' +
      '<ColorMapEntry color="#0779e4" quantity="11" label="11 - Irrigated croplands"/>' +
      '<ColorMapEntry color="#f6f578" quantity="14" label="14 - Rainfed croplands"/>' +  
      '<ColorMapEntry color="#f6d743" quantity="20" label="20 - Mosaic Croplands/Vegetation"/>' +  
      '<ColorMapEntry color="#fcbf1e" quantity="30" label="30 - Mosaic Vegetation/Croplands"/>' +    
      '<ColorMapEntry color="#06623b" quantity="40" label="40 - Closed to open broadleaved evergreen or semi-deciduous forest"/>' +    
      '<ColorMapEntry color="#b7efcd" quantity="50" label="50 - Closed broadleaved deciduous forest "/>' +    
       '<ColorMapEntry color="#94fc13" quantity="60" label="60 - Open broadleaved deciduous forest"/>' +    
      '<ColorMapEntry color="#75b79e" quantity="70" label="70 - Closed needleleaved evergreen forest"/>' +  
      '<ColorMapEntry color="#a7e9af" quantity="90" label="90 - Open neepdleleaved deciduous or evergreen forest"/>' +
      '<ColorMapEntry color="#698474" quantity="100" label="100 - Closed to open mixed broadleaved and needleleaved forest "/>' +    
      '<ColorMapEntry color="#00bdaa" quantity="110" label="110 - Mosaic Forest-Shrubland/Grassland"/>' +    
      '<ColorMapEntry color="#565d47" quantity="120" label="120 - Mosaic Grassland/Forest-Shrubland"/>' +  
      '<ColorMapEntry color="#ff926b" quantity="130" label="130 - Closed to open shrubland"/>' +
      '<ColorMapEntry color="#ffc38b" quantity="140" label="140 - Closed to open grassland"/>' +
      '<ColorMapEntry color="#fff3cd" quantity="150" label="150 - Sparse vegetation"/>' +    
      '<ColorMapEntry color="#4cbbb9" quantity="160" label="160 - Closed to open broadleaved forest regularly flooded (fresh-brackish water)"/>' +    
      '<ColorMapEntry color="#bbded6" quantity="170" label="170 - Closed broadleaved forest permanently flooded (saline-brackish water)"/>' +  
      '<ColorMapEntry color="#30e3ca" quantity="180" label="180 - Closed to open vegetation regularly flooded"/>' +
      '<ColorMapEntry color="#e84545" quantity="190" label="190 - Artificial areas "/>' +    
      '<ColorMapEntry color="#e3fdfd" quantity="200" label="200 - Bare areas"/>' +    
      '<ColorMapEntry color="#3f72af" quantity="210" label="210 - Water bodies"/>' +  
      '<ColorMapEntry color="#f5f5f5" quantity="220" label="220 - Permanent snow and ice "/>' +
      '<ColorMapEntry color="#252a34" quantity="230" label=" No data"/>' +
    '</ColorMap>' +
  '</RasterSymbolizer>';
  
var LandCover= LandCover.sldStyle(Classes)
var viz = {};
Map.addLayer(LandCover, viz, 'LandCover',1);

// Soil Moisture
//  https://developers.google.com/earth-engine/datasets/catalog/IDAHO_EPSCOR_TERRACLIMATE#description
var Soil_Moisture= ee.ImageCollection('IDAHO_EPSCOR/TERRACLIMATE').filter(ee.Filter.date('2019-09-01', '2019-12-31'));
var Soil_Moisture = Soil_Moisture.select('soil').reduce(ee.Reducer.mean()).clip(Australia);
var viz1 = { min:0 ,max:600, palette: ['8DA9C4','00A8E8','007EA7','003459','00171F'],};
Map.addLayer(Soil_Moisture, viz1, 'Soil moisture Scale 0.1',0);

// Soil Depth SLGA: Soil and Landscape Grid of Australia (Soil Attributes)
var dataset = ee.ImageCollection('CSIRO/SLGA').filter(ee.Filter.eq('attribute_code', 'DES'));
var soilDepth = dataset.select('DES_000_200_EV').mosaic().clip(Australia);
var viz2 = {min: 0, max: 2, palette: ['f1ab86', 'c57b57', '1E2D2F', '041F1E'],};
Map.addLayer(soilDepth, viz2, 'Soil Depth',0);

// Palmer Drought Severity Index https://developers.google.com/earth-engine/datasets/catalog/IDAHO_EPSCOR_TERRACLIMATE#description
var Drought_Palmer= ee.ImageCollection('IDAHO_EPSCOR/TERRACLIMATE').filter(ee.Filter.date('2019-09-01', '2019-12-31'));
var Drought_Palmer = Drought_Palmer.select('pdsi').reduce(ee.Reducer.mean()).clip(Australia);
var viz3 = { min:-300,max: 100,palette: ['C0BEA0','CD947B','E5E6E4','6D855D','40C778'],};
Map.addLayer(Drought_Palmer, viz3, 'Palmer Drought Severity Index', 0);


//__Legend0
var palette = viz
var legend = ui.Panel({style: {position: 'bottom-right',padding: '0px'}});
var legendTitle = ui.Label({value: 'Land Cover',style: {fontWeight: 'bold',fontSize: '12px',margin: '0px 0px 0px 0px',padding: '0px'}});
legend.add(legendTitle);

//__Legend1
var palette1 = viz1
var legend1 = ui.Panel({style: {position: 'middle-right',padding: '0px 0px'}});
var legendTitle = ui.Label({value: 'Soil Moisture',style: {fontWeight: 'bold',fontSize: '12px',margin: '0 0 0 0',padding: '0'}});
legend1.add(legendTitle);
var lon = ee.Image.pixelLonLat().select('latitude');
var gradient = lon.multiply((palette1.max-palette1.min)/100.0).add(palette1.min);
var legendImage = gradient.visualize(palette1);
var panel = ui.Panel({widgets: [ui.Label(palette1['max']*	0.1+'mm')],});
legend1.add(panel);
var thumbnail = ui.Thumbnail({image: legendImage,params: {bbox:'0,0,10,90', dimensions:'10x60'},
                    style: {margin: '0 0 0 0', padding: '0', position: 'middle-left'}});
legend1.add(thumbnail);
var panel = ui.Panel({widgets: [ui.Label(palette1['min']*	0.1+'mm')],});
legend1.add(panel);
//__Legend2
var palette2 = viz2
var legend2 = ui.Panel({style: {position: 'middle-right',padding: '0px 0px'}});
var legendTitle = ui.Label({value: 'Soil Depth',style: {fontWeight: 'bold',fontSize: '12px',margin: '0 0 0 0',padding: '0'}});
legend2.add(legendTitle);
var lon = ee.Image.pixelLonLat().select('latitude');
var gradient = lon.multiply((palette2.max-palette2.min)/100.0).add(palette1.min);
var legendImage = gradient.visualize(palette2);
var panel = ui.Panel({widgets: [ui.Label(palette2['max']+'m')],});
legend2.add(panel);
var thumbnail = ui.Thumbnail({image: legendImage,params: {bbox:'0,0,10,90', dimensions:'10x60'},
                 style: {margin: '0 0 0 0', padding: '0', position: 'middle-left'}});
legend2.add(thumbnail);
var panel = ui.Panel({widgets: [ui.Label(palette2['min']+'m')],});
legend2.add(panel);
//__Legend3
var palette3 = viz3
var legend3 = ui.Panel({style: {position: 'middle-right',padding: '0px 0px'}});
var legendTitle = ui.Label({value: 'Drought Index',style: {fontWeight: 'bold',fontSize: '12px',margin: '0 0 0 0',padding: '0'}});
legend3.add(legendTitle);
var lon = ee.Image.pixelLonLat().select('latitude');
var gradient = lon.multiply((palette3.max-palette3.min)/100.0).add(palette3.min);
var legendImage = gradient.visualize(palette3);
var panel = ui.Panel({widgets: [ui.Label(palette3['max']*0.01)],});
legend3.add(panel);
var thumbnail = ui.Thumbnail({image: legendImage,params: {bbox:'0,0,10,90', dimensions:'10x60'}, style: {margin: '0 0 0 0', padding: '0', position: 'middle-left'}});
legend3.add(thumbnail);
var panel = ui.Panel({widgets: [ui.Label(palette3['min']*0.01)],});
legend3.add(panel);


//________________END-BaseMap____________________________________________________

var image=[LandCover,Soil_Moisture,soilDepth,Drought_Palmer];

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
