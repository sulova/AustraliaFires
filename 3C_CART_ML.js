//Purpose: Thesis - Burned Area in Australia;
//AUthor: Andrea Sulova;
//Date: March 2020;

//______Import SHP Australian's States__________________________________________
var Australia_shp = ee.FeatureCollection("users/sulovaandrea/Australia_Polygon");
var Australia_shp_geometry = Australia_shp.geometry();


//______Import States in Australia____________________________________________
var Capital_AUS = Australia_shp.filterMetadata("name","equals","Australian Capital Territory");
var Northen_AUS = Australia_shp.filterMetadata("cc","equals","Northern Territory")
var Queensland = Australia_shp.filterMetadata("name","equals","Queensland")
var South_AUS = Australia_shp.filterMetadata("name","equals","South Australia")
var Tasmania = Australia_shp.filterMetadata("name","equals","Tasmania")
var Victoria = Australia_shp.filterMetadata("name","equals","Victoria")
var Western_AUS = Australia_shp.filterMetadata("name","equals","Western Australia")
var NewSouthWales = Australia_shp.filterMetadata("name","equals","New South Wales")

//______AOI_____________________________________________________________________
var Australia = ee.FeatureCollection("USDOS/LSIB/2013").filterMetadata("cc","equals","AS")
Map.centerObject(Australia,4);   

//______VARIABLES_______________________________________________________________
// 1 LandCover
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
Map.addLayer(LandCover.sldStyle(Classes), {}, 'Land Cover',0);

// 2  30mTographical data processing for land cover classification and RF modelling 
var srtm = ee.Image('USGS/SRTMGL1_003');
var srtm = srtm.clip(Australia)
var elevation = srtm.select('elevation');
var slope = ee.Terrain.slope(elevation);
var aspect = ee.Terrain.aspect(elevation);

var palette = ['85a392','565d47','155263','393e46','52616b','c9d6df','eeeeee']
Map.addLayer(elevation, {min: 150, max: 900,palette: palette}, 'SRTM 30m elevation',0);

var palette = ['ececec','c1a57b','30475e','222831']
Map.addLayer(slope, {min: 0, max: 2,palette: palette}, 'SRTM 30m slope',0);

var palette = ['ffffff','ffa372','512b58','2c003e']
Map.addLayer(aspect, {min: 0, max: 360, palette: palette}, 'SRTM 30m aspect',0);

// 3 Population WorldPop Global Project Population Data 100m
// https://developers.google.com/earth-engine/datasets/catalog/CAS_IGSNRR_PML_V2#bands
var dataset = ee.ImageCollection("WorldPop/GP/100m/pop").filterDate('2019');
var pop_100m = dataset.select('population');
var populationVis = { min: 0.0, max: 0.05,palette: ['3C1642','92dce5','affc41','d4ff50', 'f6f578','f6d743','f6f578']}
var pop_100m = pop_100m.mosaic().clip(Australia) 
Map.addLayer(pop_100m,populationVis, 'Population 100m',0);

// 4 Road
var road_shp = ee.FeatureCollection("users/sulovaandrea/AUS_roads");
var road_img = ee.Image().toByte().paint(road_shp, 1);
var road_no_img = road_img.unmask(0).gt(0);
var cumulativeCost_road = ee.Image(1).cumulativeCost({source: road_no_img, maxDistance: 50000 });    
var cumulativeCost_road_clip = cumulativeCost_road.clip(Australia)    
var palette1 = ['024249','16817a','fa744f','ffa372']
Map.addLayer(cumulativeCost_road_clip, {min: 0, max: 50000, palette: palette1}, 'Roads cost 50 km', 0);
Map.addLayer(road_img,{min: 0, max: 1, palette: '222831'},'Roads',0);

var Cost_road_1km = ee.Image(1).cumulativeCost({source: road_no_img, maxDistance: 50000})
    .reproject(ee.Projection('EPSG:4326').atScale(500));  
var Cost_road_1km = Cost_road_1km.unmask(1000000).clip(Australia) 
Map.addLayer(Cost_road_1km, {min: 0, max: 50000, palette: palette1}, 'Roads Coast 50km Raster', 0);    

// 5 Electric Line 
var ele_line = ee.FeatureCollection("users/sulovaandrea/Aus_Electric_Line");
var ele_img = ee.Image().toByte().paint(ele_line, 1).clip(Australia);
var ele_no_img = ele_img.unmask(0).gt(0).clip(Australia);
var palette2 = ['06623b', 'black']
Map.addLayer(ele_img,{min: 0, max: 1, palette: palette2},'Electric Line',0);
var Cost_ele_1km = ele_no_img.reproject(ee.Projection('EPSG:4326').atScale(1000)).clip(Australia);
Map.addLayer(Cost_ele_1km, {min: 0, max: 1, palette: palette2}, 'Electric Line Raster', 0);
    
// 7 Human Modification - 1km
//https://developers.google.com/earth-engine/datasets/catalog/CSP_HM_GlobalHumanModification#description
var GHM = ee.ImageCollection("CSP/HM/GlobalHumanModification")
var GHM_index = GHM.mean().clip(Australia)
var palette_GHM = ['85a392','#C7B808','#4E8E07','26D5F6','DDCC09','#16089C']
Map.addLayer(GHM_index, {min:0, max:1, palette:palette_GHM}, 'Global Human Modification',0);

// 8 MODIS NDVI 250m
var dataset = ee.ImageCollection('MODIS/006/MOD13Q1').filter(ee.Filter.date('2019-08-01', '2019-09-01'));
var ndvi = dataset.select('NDVI').mean().clip(Australia);;
var ndviVis = { min: 0.0, max: 8000.0,palette: ['FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901',
    '66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01', '012E01', '011D01', '011301'],};
Map.addLayer(ndvi, ndviVis, 'NDVI 250 MODIS',0);

// 9 Soil Depth SLGA: Soil and Landscape Grid of Australia (Soil Attributes)
// 90m Depth of soil profile (A & B horizons)
var dataset = ee.ImageCollection('CSIRO/SLGA').filter(ee.Filter.eq('attribute_code', 'DES'));
var soilDepth = dataset.select('DES_000_200_EV').mosaic().clip(Australia);
var soilDepthVis = {min: 0, max: 2, palette: ['252525', 'f1ab86', 'c57b57', '1E2D2F', '041F1E'],};
Map.addLayer(soilDepth, soilDepthVis, 'Soil Depth',0);

// 11 Climate - WIND SPEED 2.5 arc minutes more then 2km
//https://developers.google.com/earth-engine/datasets/catalog/IDAHO_EPSCOR_TERRACLIMATE#description
var vs = ee.ImageCollection('IDAHO_EPSCOR/TERRACLIMATE').filter(ee.Filter.date('2018-08-31', '2019-08-31'));
var vs = vs.select('vs').reduce(ee.Reducer.mean()).clip(Australia);
var vsVis = { min:100,max: 400,palette: ['F7F3F0','DFDFDF','496A81','1E96FC','00171F'],};
Map.addLayer(vs, vsVis, 'Wind-speed at 10m Scale 0,01',0);

// 12 Maximum temperature  2.5 arc minutes more then 2km
//https://developers.google.com/earth-engine/datasets/catalog/IDAHO_EPSCOR_TERRACLIMATE#description
var temp_max = ee.ImageCollection('IDAHO_EPSCOR/TERRACLIMATE').filter(ee.Filter.date('2018-08-31', '2019-08-31'));
var temp_max = temp_max.select('tmmx').reduce(ee.Reducer.mean()).clip(Australia);
var vsVis = { min: 200,max: 400,palette: ['F9EBE0','F5E663','E3B505','F18805','EA2B1F','550527'],};
Map.addLayer(temp_max, vsVis, 'Maximum temperature  Scale 0,1',0);

// 13 Palmer Drought Severity Index https://developers.google.com/earth-engine/datasets/catalog/IDAHO_EPSCOR_TERRACLIMATE#description
var Drought_Palmer= ee.ImageCollection('IDAHO_EPSCOR/TERRACLIMATE').filter(ee.Filter.date('2018-08-31', '2019-08-31'));
var Drought_Palmer = Drought_Palmer.select('pdsi').reduce(ee.Reducer.mean()).clip(Australia);
var DroughVis = { min:-300,max: 100,palette: ['40C778','6D855D','C0BEA0','CD947B','E5E6E4'],};
Map.addLayer(Drought_Palmer, DroughVis, 'Palmer Drought Severity Index', 0);

// 14 Precipitation accumulation https://developers.google.com/earth-engine/datasets/catalog/IDAHO_EPSCOR_TERRACLIMATE#description
var Precipitation= ee.ImageCollection('IDAHO_EPSCOR/TERRACLIMATE').filter(ee.Filter.date('2019-08-01', '2020-02-15'));
var Precipitation = Precipitation.select('pr').reduce(ee.Reducer.mean()).clip(Australia);
var PrecipVIS = { min:0 ,max: 70, palette: ['EEF4ED','8DA9C4','00A8E8','007EA7','003459','00171F'],};
Map.addLayer(Precipitation, PrecipVIS, 'Precipitation accumulation mm',0);

// 15 Soil Moisture https://developers.google.com/earth-engine/datasets/catalog/IDAHO_EPSCOR_TERRACLIMATE#description
var Soil_Moisture= ee.ImageCollection('IDAHO_EPSCOR/TERRACLIMATE').filter(ee.Filter.date('2019-01-01', '2019-08-31'));
var Soil_Moisture = Soil_Moisture.select('soil').reduce(ee.Reducer.mean()).clip(Australia);
var PrecipVIS = { min:0 ,max:600, palette: ['EEF4ED','8DA9C4','00A8E8','007EA7','003459','00171F'],};
Map.addLayer(Soil_Moisture, PrecipVIS, 'Soil moisture Scale 0.1',0);

//______M E R G E ____ A L L___ V A R I A B L E S __________________________________________________    

var merge = LandCover.addBands(elevation).addBands(slope).addBands(aspect).addBands(GHM_index)
      .addBands(pop_100m).addBands(Soil_Moisture).addBands(Cost_road_1km).addBands(Cost_ele_1km)
      .addBands(ndvi).addBands(soilDepth).addBands(vs).addBands(temp_max).addBands(Drought_Palmer).addBands(Precipitation)
                
var merge = merge.select(
['discrete_classification', 'elevation', 'slope', 'aspect', 'gHM', 'population', 'soil_mean', 'cumulative_cost','constant','NDVI', 'DES_000_200_EV', 'vs_mean', 'tmmx_mean', 'pdsi_mean', 'pr_mean'],
['Land Cover', 'Elevation', 'Slope', 'Aspect', 'Global Human Modification', 'Population', 'Soil Moisture', 'Distance From Road', 'Electric Network', 'NDVI', 'Soil Depth', 'Wind Speed', 'Temperature', 'Drought','Precipitation'])

var bands= ['Land Cover', 'Elevation', 'Slope', 'Aspect', 'Global Human Modification', 'Population', 'Soil Moisture', 'Distance From Road', 'Electric Network', 'NDVI', 'Soil Depth', 'Wind Speed', 'Temperature', 'Drought','Precipitation']

//____R A N D O M __F O R E S T__C L A S S I F I C A T I O N ____________________________________________________      

var point = ee.FeatureCollection("users/sulovaandrea/TrainingDataset")

var active_fire_point = point.filterMetadata("fire","equals",1)
Map.addLayer(active_fire_point, {color:'orange',size:0.1}, 'Active Fire Points',0);
var No_fire_point = point.filterMetadata("fire","equals",0)
Map.addLayer(No_fire_point, {color:'black',size:0.1}, 'No-Fire Points',0);

var classifierTraining = merge.sampleRegions(
            {collection: point,
            properties: ['fire'],
            scale: 100});
                  
//print('Number of trained samples: ', classifierTraining.size())

// Make a Random Forest classifier and train it.
var RF_classifier = ee.Classifier.smileCart(200).train(
                    {features:classifierTraining,
                    classProperty:'fire',inputProperties: bands});
  
var classification = merge.classify(RF_classifier);
Map.addLayer(classification, {min: 0, max: 1, palette: ['green', 'red']},'classification', 0);    
 
var classifier_Pro = ee.Classifier.smileCart(200).setOutputMode('PROBABILITY').train(classifierTraining,"fire"); 
var classification_Pro = merge.classify(classifier_Pro);
Map.addLayer(classification_Pro, {min: 0, max: 1, palette: ['green', 'red']},'classification_Pro', 0);    
                                  
//_____ A C C U R A C Y___ A S S E S S M E N T_________________________________________________  

var split = 0.7;  // Roughly 70% training, 30% testing.
var classifierTraining= classifierTraining.randomColumn();
var trained = classifierTraining.filter(ee.Filter.lt('random', split));
var test = classifierTraining.filter(ee.Filter.gte('random', split));
//print('Number of training dataset: ', trained.size())
//print('Number of test dataset: ', test.size())

var classifier_trained = ee.Classifier.smileCart(200).train
                          ({features:trained,
                          classProperty:'fire',
                          inputProperties: bands});
                          
var test_classification = test.classify(classifier_trained)
var confusionMatrix =test_classification.errorMatrix('fire','classification');    
var confusionMatrixArray = ee.Feature(null, {matrix: confusionMatrix.array()});
print('Confusion Matrix:', confusionMatrixArray);
var overAccuracy = ee.Feature(null, {matrix: confusionMatrix.accuracy()});
print('Overal Accuracy:', overAccuracy)
//var prodAccuracy = ee.Feature(null,{matrix:confusionMatrix.producersAccuracy()})
//print('Producers Accuracy:', prodAccuracy)
//var consAccuracy = ee.Feature(null,{matrix:confusionMatrix.consumersAccuracy()});
//print('Consumers Accuracy:', consAccuracy)
var kappa = ee.Feature(null, {matrix: confusionMatrix.kappa()});
print(' kappa:', kappa)

//____V A R I A B L E______ I M P O R T A N C E_____________________________________    
var dict = RF_classifier.explain();
print('Explain:',dict);

var variable_importance = ee.Feature(null, ee.Dictionary(dict).get('importance'));
 
var chart = ui.Chart.feature.byProperty(variable_importance).setChartType('ColumnChart')
          .setOptions({title: 'Random Forest Variable Importance',
          legend: {position: 'none'},
          hAxis: {title: 'Bands'},vAxis: {title: 'Importance'}});
print(chart);
