# Australian Wildfires - a machine learning approach 

**Exploratory analysis of wild-fires in Australia & a machine learning approach 
for wildfire modeling in Google Earth Engine**

The free remotely sensed data allows analyzing this disaster and therefore this thesis investigates the Australian wildfires based data from Earth observation with the respect to uncovering the general insights. In the last few years, machine learning (ML) has proven to be successful in many domains due to the capability of learning also from hidden relationships. 

In this study, the overall objective is to create an automatized process of creating a fire training dataset at a continental level with an efficient computational expense for the ML algorithms. These results of fire occurrence locations and no-fire occurrence locations are mapped alongside with 15 fire causal factors. 

**The training dataset is applied to different ML algorithms, such as Random Forest (RF), Naïve Bayes, and Classification and Re-gression Tree (CART).**

All ML approaches were trained using 70% of the wildﬁre dataset and tested using the remaining 30% of the dataset. The ML algorithm with the best performance, the RF model, helps to identify the driving factors using variable importance analysis based on ML methods. Typically, this model can learn certain properties from a training dataset to make predictions. Thus, the re-sults of this thesis study disclose the fire occurrence probability in Australia as well as identified the driving factors and their dynamic influence on fire occurrence. Improved preventive measures can be implemented in the fire-prone areas to reduce the risk of fire in Australia by considering the factors identified in this study.	 

*The flowchart of processes employed in the study for generating the predictive model in GEE.*


![Image](https://github.com/sulova/AustraliaFires/blob/master/image/Cap_1.PNG)

## Data mining and pre-processing 
Data mining and pre-processing is an important step to generate the training da-taset as an input for the ML models. The training dataset consists of independent variables also referred to as the predictors (land cover, temperature, etc.) and dependent variables also known as the responding variables (fire, no-fire). 

### Dependent variable
The dependent variable in this study is fire and non-fire occurrence locations. Thus, mapping susceptibility of ﬁre occurrence can be considered from the ML perspective as a binary classiﬁcation problem with two classes: fire and no-ﬁre. However, the dataset of recently occurred fire locations with high resolution is not available form the Australian official sources. Therefore, collecting fire and no-fire occurrence locations is developed in this study as an automated workflow presented in Figure.

*The flowchart of ﬁre occurrence locations applied in methodology.*
![Image](https://github.com/sulova/AustraliaFires/blob/master/image/Cap_2.PNG)

*The distribution of fire and no-point from the automated process
![Image](https://github.com/sulova/AustraliaFires/blob/master/image/Cap_7.PNG)

*An example of wildfire in pre-fire and post-fire RGB imagery and monthly active fire from the S-2 mis-sion for visual verification of fire points.

![Image](https://github.com/sulova/AustraliaFires/blob/master/image/Cap_11.PNG)

### Independent Variables	
Creating the selection of independent variables, which are also known as predic-tors or conditioning factors,  is a critical step in predictive modelling. For this study, 15 conditioning factors are selected based on both the field observation found in different studies and available satellite data on the GEE platform. These applied wildﬁre conditioning factors can be divided into five categories, such as topog-raphy, vegetation type, infrastructure, meteorology and socio-economic factors. Table 3 summarizes each of the datasets used in this study.

*The list and description of variable datasets included in the study.*
![Image](https://github.com/sulova/AustraliaFires/blob/master/image/Cap_3.PNG)

*Topographical factors: elevation, aspect and slope.*
![Image](https://github.com/sulova/AustraliaFires/blob/master/image/Cap_4.PNG)

*Climate factors: precipitation, maximum temperature and wind speed.*
![Image](https://github.com/sulova/AustraliaFires/blob/master/image/Cap_5.PNG)

*Environmental factors: land cover (the legend is in Appendix), soil depth, soil moisture, 
drought severity index and NDVI.*
![Image](https://github.com/sulova/AustraliaFires/blob/master/image/Cap_6.PNG)

*Socio-economic factors: GHM, population, electric lines and distance from roads.*
![Image](https://github.com/sulova/AustraliaFires/blob/master/image/Cap_66.PNG)
