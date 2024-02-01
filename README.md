# Australian Wildfires - a machine learning approach 

if you find this repository useful in your research, please consider citing the following papers. Thank you.
- Sulova, Andrea, and Jamal Jokar Arsanjani. 2021. "Exploratory Analysis of Driving Force of Wildfires in Australia: An Application of Machine Learning within Google Earth Engine" Remote Sensing 13, no. 1: 10. https://doi.org/10.3390/rs13010010

**Exploratory analysis of wild-fires in Australia & a machine learning approach 
for wildfire modeling in Google Earth Engine**

The free remotely sensed data allows analyzing this disaster and therefore this study investigates the Australian wildfires based data from Earth observation with the respect to uncovering the general insights. In the last few years, machine learning (ML) has proven to be successful in many domains due to the capability of learning also from hidden relationships. 

In this study, the overall objective is to create an automatized process of creating a fire training dataset at a continental level with an efficient computational expense for the ML algorithms. These results of fire occurrence locations and no-fire occurrence locations are mapped alongside with 15 fire causal factors. 

**The training dataset is applied to different ML algorithms, such as Random Forest (RF), Naïve Bayes, and Classification and Regression Tree (CART).**

All ML approaches were trained using 70% of the wildﬁre dataset and tested using the remaining 30% of the dataset. The ML algorithm with the best performance, the RF model, helps to identify the driving factors using variable importance analysis based on ML methods. Typically, this model can learn certain properties from a training dataset to make predictions. Thus, the results of this study disclose the fire occurrence probability in Australia as well as identified the driving factors and their dynamic influence on fire occurrence. Improved preventive measures can be implemented in the fire-prone areas to reduce the risk of fire in Australia by considering the factors identified in this study.	 

*The flowchart of processes employed in the study for generating the predictive model in GEE.*


![Image](https://github.com/sulova/AustraliaFires/blob/master/image/Cap_1.PNG)

## Data mining and pre-processing 
Data mining and pre-processing is an important step to generate the training dataset as an input for the ML models. The training dataset consists of independent variables also referred to as the predictors (land cover, temperature, etc.) and dependent variables also known as the responding variables (fire, no-fire). 

### Dependent variable
The dependent variable in this study is fire and non-fire occurrence locations. Thus, mapping susceptibility of ﬁre occurrence can be considered from the ML perspective as a binary classiﬁcation problem with two classes: fire and no-ﬁre. However, the dataset of recently occurred fire locations with high resolution is not available form the Australian official sources. Therefore, collecting fire and no-fire occurrence locations is developed in this study as an automated workflow presented in Figure.

*The flowchart of ﬁre occurrence locations applied in methodology.*
![Image](https://github.com/sulova/AustraliaFires/blob/master/image/Cap_2.PNG)

*The distribution of fire and no-point from the automated process*
![Image](https://github.com/sulova/AustraliaFires/blob/master/image/Cap_7.PNG)

*An example of wildfire in pre-fire and post-fire RGB imagery and monthly active fire from the S-2 mission for visual verification of fire points.*

![Image](https://github.com/sulova/AustraliaFires/blob/master/image/Cap_11.PNG)

### Independent Variables	
Creating the selection of independent variables, which are also known as predictors or conditioning factors,  is a critical step in predictive modelling. For this study, 15 conditioning factors are selected based on both the field observation found in different studies and available satellite data on the GEE platform. These applied wildﬁre conditioning factors can be divided into five categories, such as topography, vegetation type, infrastructure, meteorology and socio-economic factors. Table 3 summarizes each of the datasets used in this study.

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


# Results

## Predictive model

Predictive modeling is the overall concept of building a ML model that is capable of making predictions. Typically, such a model includes a machine learning algorithm that learns certain properties from a training dataset in order to make those predictions. In this study, the RF model and the training dataset present the wildfires in Australia during the 2019
2020 season.

*The fire susceptibility map using the RF model.*
![Image](https://github.com/sulova/AustraliaFires/blob/master/image/Cap_8.PNG)

*The fire susceptibility map with classes using the RF model.*
![Image](https://github.com/sulova/AustraliaFires/blob/master/image/Cap_9.PNG)

## Accuracy Assessment of ML Algorithms
The widely used accuracy assessment method is used to evaluate the performance of the ML models. The accuracy assessment is calculated based on the independent testing datasets gathered from the sample dataset. This sample dataset is split in the 70:30 ratio, meaning the 70% of the dataset is used for training the model and 30% is applied for testing. Thus, the selected pixel-based supervised ML algorithms, namely, RF, CART and NB, are trained using a 70% training dataset representing 3250 test samples. The samples contain 1633 fire class and 1617 no-fire class.
As seen below, the accuracy of the CART model increases with the number of leaf nodes until the number of 300 leaf nodes is reached. From more than 300 leaf nodes, the accuracy of the model is almost constant. The results of the RF model shown in Figure 16 reveals that with the increasing number of trees, the accuracy is increased as well. Thus, the optimal number of trees applied in the RF model in this study is 300 trees.

*The accuracy of CART models with a different number of leaf nodes applied.*
![Image](https://github.com/sulova/AustraliaFires/blob/master/image/CART.png)

*The accuracy of RD models with a different number of trees applied*
![Image](https://github.com/sulova/AustraliaFires/blob/master/image/RF.png)

## Importance of conditioning factors

The variable importance was calculated based on the training dataset

*The variable importance analysis based on the RF model.*
![Image](https://github.com/sulova/AustraliaFires/blob/master/image/VI.png)

To identify the extent to which one variable relates to another variable, it is important to compute the correlations using the Pearson method. This measures the linear relationship between variables and has a value between 1 and -1. The mutual relationships among variables by visualizing the correlation matrix as a heatmap is shown below.  Each cell in the correlation matrix is a ‘correlation coefficient‘ between the two variables corresponding to the row and column of the cell. A large positive correlation (near to 1.0) is indicated between NDVI and precipitation, i.e., if the value of one of the variables increases, the value of the other variable increases as well. Most of the values are near to 0 (both positive or negative) and indicates the absence of any correlation between variables, and hence those variables are independent of each other

*The correlation matrix of causal factors as a heatmap.*
![Image](https://github.com/sulova/AustraliaFires/blob/master/image/PCA.png)
