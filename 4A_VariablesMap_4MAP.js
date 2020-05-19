//______AOI_____________________________________________________________________
var Australia = ee.FeatureCollection("USDOS/LSIB/2013").filterMetadata("cc","equals","AS")
Map.centerObject(Australia,4); 
Map.addLayer(Australia)

// 1 Human Modification - 1km
//https://developers.google.com/earth-engine/datasets/catalog/CSP_HM_GlobalHumanModification#description
var GHM = ee.ImageCollection("CSP/HM/GlobalHumanModification")
var GHM_index = GHM.mean().clip(Australia)
var viz = {min:0, max:1, palette:['85a392','#C7B808','#4E8E07','26D5F6','blue']}
Map.addLayer(GHM_index, viz, 'Global Human Modification',0);


// 2 Population WorldPop Global Project Population Data 100m
// https://developers.google.com/earth-engine/datasets/catalog/CAS_IGSNRR_PML_V2#bands
var dataset = ee.ImageCollection("WorldPop/GP/100m/pop").filterDate('2019');
var pop_100m = dataset.select('population');
var viz1 = { min: 0.0, max: 0.05,palette: ['3C1642','92dce5','affc41','d4ff50', 'f6f578','f6d743']}
var pop_100m = pop_100m.mosaic().clip(Australia) 
Map.addLayer(pop_100m,viz1, 'Population 100m',0);

// 3 Road
var road_shp = ee.FeatureCollection("users/sulovaandrea/AUS_roads");
var road_img = ee.Image().toByte().paint(road_shp, 1);
var road_no_img = road_img.unmask(0).gt(0);
var cumulativeCost_road = ee.Image(1).cumulativeCost({source: road_no_img, maxDistance: 30000 });    
var cumulativeCost_road_clip = cumulativeCost_road.clip(Australia)    
var viz2 = {min: 0, max:30000, palette: ['024249','16817a','ffe277','fa744f','ffa372']}
Map.addLayer(cumulativeCost_road_clip,viz2 , 'Roads cost 30 km', 0);
Map.addLayer(road_img,{min: 0, max: 1, palette: '222831'},'Roads',0);

// 4 Electric Line 
var ele_line = ee.FeatureCollection("users/sulovaandrea/Aus_Electric_Line");
var ele_img = ee.Image().toByte().paint(ele_line, 1).clip(Australia);
var ele_no_img = ele_img.unmask(0).gt(0).clip(Australia);
var viz3 = {min: 0, max: 1, palette: ['06623b', 'black']}
Map.addLayer(ele_img,viz3,'Electric Line',0);
var Cost_ele_1km = ele_no_img.reproject(ee.Projection('EPSG:4326').atScale(1000)).clip(Australia);
Map.addLayer(Cost_ele_1km, {min: 0, max: 1, palette: palette2}, 'Electric Line Raster', 0);


//________________________________________________________________________________
//Legend
var palette = viz
var legend = ui.Panel({style: {position: 'bottom-right',padding: '0px'}});
var legendTitle = ui.Label({value: 'gHM',style: {fontWeight: 'bold',fontSize: '12px',margin: '0px 0px 0px 0px',padding: '0px'}});
legend.add(legendTitle);
var lon = ee.Image.pixelLonLat().select('latitude');
var gradient = lon.multiply((palette.max-palette.min)/100.0).add(palette.min);
var legendImage = gradient.visualize(palette);
var panel = ui.Panel({widgets: [ui.Label(palette['max'])],  style: {fontSize: '10px',margin: '0px 0px 0px 0px', padding: '0px'}});
legend.add(panel);
var thumbnail = ui.Thumbnail({image: legendImage,params: {bbox:'0,0,10,90', dimensions:'10x60'},style: {margin: '0 0 0 0', padding: '0', }});
legend.add(thumbnail);
var panel = ui.Panel({widgets: [ui.Label(palette['min'])], style: {margin: '0 0 0 0', padding: '0px',fontSize: '10px'}});
legend.add(panel);

//__Legend1
var palette1 = viz1
var legend1 = ui.Panel({style: {position: 'middle-right',padding: '0px 0px'}});
var legendTitle = ui.Label({value: 'Population',style: {fontWeight: 'bold',fontSize: '12px',margin: '0 0 0 0',padding: '0'}});
legend1.add(legendTitle);
var lon = ee.Image.pixelLonLat().select('latitude');
var gradient = lon.multiply((palette1.max-palette1.min)/100.0).add(palette1.min);
var legendImage = gradient.visualize(palette1);
var panel = ui.Panel({widgets: [ui.Label(palette1['max'])],});
legend1.add(panel);
var thumbnail = ui.Thumbnail({image: legendImage,params: {bbox:'0,0,10,90', dimensions:'10x60'},
                    style: {margin: '0 0 0 0', padding: '0', position: 'middle-left'}});
legend1.add(thumbnail);
var panel = ui.Panel({widgets: [ui.Label(palette1['min'])],});
legend1.add(panel);
//__Legend2
var palette2 = viz2
var palette2_Edit = {min: 0, max:30, palette: ['024249','16817a','ffe277','fa744f','ffa372']}
var legend2 = ui.Panel({style: {position: 'middle-right',padding: '0px 0px'}});
var legendTitle = ui.Label({value: 'Road',style: {fontWeight: 'bold',fontSize: '12px',margin: '0 0 0 0',padding: '0'}});
legend2.add(legendTitle);
var lon = ee.Image.pixelLonLat().select('latitude');
var gradient = lon.multiply((palette2.max-palette2.min)/100.0).add(palette1.min);
var legendImage = gradient.visualize(palette2);
var panel = ui.Panel({widgets: [ui.Label(palette2_Edit['max']+'km')],});
legend2.add(panel);
var thumbnail = ui.Thumbnail({image: legendImage,params: {bbox:'0,0,10,90', dimensions:'10x60'},
                 style: {margin: '0 0 0 0', padding: '0', position: 'middle-left'}});
legend2.add(thumbnail);
var panel = ui.Panel({widgets: [ui.Label(palette2_Edit['min']+'km')],});
legend2.add(panel);
//__Legend3

var legend3= ui.Panel({style: { position: 'middle-right',padding: '0px 0px'}});
var legendTitle = ui.Label({value: '', style: {fontWeight: 'bold',fontSize: '15px',margin: '0 0 0 0',padding: '0'}});
legend3.add(legendTitle);
var makeRow = function(color, name) {var colorBox = ui.Label({style: {backgroundColor: '#' + color, padding: '8px',margin: '0 0 0 0'}});
     var description = ui.Label({value:name,style: {margin: '0 0 0 3px'}});
     return ui.Panel({widgets: [colorBox, description],layout: ui.Panel.Layout.Flow('horizontal')});};
var palette =['1b1b2f'];
var vis3 = ['Electric Line'];
for (var i = 0; i < 1; i++) {legend3.add(makeRow(palette[i], vis3[i]));}  



//________________END-BaseMap____________________________________________________

var image=[GHM_index, pop_100m, cumulativeCost_road_clip, ele_img];

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
