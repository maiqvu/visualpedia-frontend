import React from 'react';
import axios from 'axios';
import Chart from './Chart';
import CheckBox from './CheckBox';
import SelectIndicator from './SelectIndicator'
import NewsFeed from './NewsFeed'
import '../App.css'
import _ from 'lodash/collection';
const BASE_URL = `https://api.worldbank.org/v2/country/`;

class ChartInfo extends React.Component {
  state = {
    sortedResults: [],
    resultsToDisplay: [],
    infoToChart: [],
    countriesLabel: [],
    currentContinent: [],
    countriesToSearch: '',
    indicatorToDisplay: 'AG.LND.AGRI.ZS',
    title: ''
  }

  splitData = (arrayToGroup) => {
    // lodash group by array, constant, what should be returned
    const rawData = _.groupBy(arrayToGroup, countryEach => countryEach.country.value)
    // create list to get name of all countries from api call
    this.setState({title: arrayToGroup[0].indicator.value});
    let countryEach = []
    // loop through data get key values
    for (let key in rawData){
    // push keys into countryEach
      countryEach.push(key)
    }
    // set countries each to eqaul counties searched for
    this.setState({countriesLabel: countryEach,
                   sortedResults: rawData,
                   infoToChart: rawData});
    // search sorted results to rawData
    // this.setState({sortedResults: rawData})
    // this.setState({infoToChart: rawData})
  } // spilt data

  getCountryAbbreviations = continent => {
    const countryAbbreviations = {
      northAmerica: 'us;ca;mx;cu;ni',  // US, Canada, Mexico, Cuba, Nicaragua
      southAmerica: 'ar;br;sr;ve;co',  // Argentina, Brazil, Suriname, Venezuela, Colombia
      africa: 'eg;za;ng;sd;cm',  // Egypt, South Africa, Nigeria, Sudan, Cameroon
      europe: 'at;de;es;fr;gb',  // Austria, Germany, Spain, France, Great Britain
      asia: 'id;in;kw;cn;ru',  // Indonesia, India, Kuwait, China, Russia
      oceania: 'au;nz;to;nr;fj'  // Australia, New Zealand, Tonga, Nauru, Fiji
    };
    return countryAbbreviations[continent];
  }

  performSearch = (countries, indicator, timeRange='2006:2015') => {

    const continent = this.props.match.params.continent;
    axios.get(`https://api.worldbank.org/v2/country/${countries}/indicator/${indicator}?date=${timeRange}&format=json`)
    .then(res => {
      // take base url and call sortData() with data argument

      this.splitData(res.data[1]);
    })
    .then(() => {
      this.updateChartDisplay();
    })
    .catch( err => {
      console.warn(err)
    })
  } // performSearch


  handleChange = (e) => {
    // get state save as preSelection
    let preSelection = this.state.resultsToDisplay;
    // target event
    const target = e.target;
    // get value of event
    const value = target.value;
    // if state has value
   if (!target.checked) {  // preSelection.includes(value)
     // remove value from preSelection
     const toDisplay = preSelection.filter(e => e !== value)
     // update sates to include only 'ticked' items
     this.setState({resultsToDisplay: toDisplay})
     console.log('selected false');

   } else {
     console.log('selected true');
     // add new county to rest of state save as joined
     const joined = this.state.resultsToDisplay.concat(value);
     // update state with new value
     this.setState({ resultsToDisplay: joined });
   } // if



  } // handleChange

  changeIndicator = (e) => {

    let value = e.target.value

    this.setState({indicatorToDisplay: value})

  } // changeIndicator

  updateChartDisplay(){
    let listToUpdateState = {};
    let listToCompareObject = this.state.sortedResults
    let listToCompareName = this.state.resultsToDisplay

    listToCompareName.forEach(c => {
      listToUpdateState[c] = listToCompareObject[c]
    })

    this.setState({infoToChart: listToUpdateState})
  }

  getNews(){
    let continent = this.props.match.params.continent
    let newsSearch;
    if (continent === 'africa') {
      newsSearch = 'ng'
    } else if (continent === 'northAmerica') {
      newsSearch = 'us'
    } else if (continent === 'southAmerica'){
      newsSearch = 'ar'
    } else if (continent === "europe") {
      newsSearch = 'gb'
    } else if (continent === 'asia') {
      newsSearch = 'ru'
    } else {
      newsSearch = 'au'
    }

    return newsSearch
  }

  componentDidMount(){
    const continent = this.props.match.params.continent;
    this.setState({currentContinent: continent});

    // pass props in imediataly
    // pass in countrys to search and indicator
    this.performSearch(this.getCountryAbbreviations(continent), this.state.indicatorToDisplay);
  } // componentdidmount

  componentDidUpdate(prevProps, prevState){
    if (prevState.indicatorToDisplay !== this.state.indicatorToDisplay) {
      const continent = this.state.currentContinent

      this.performSearch(this.getCountryAbbreviations(continent), this.state.indicatorToDisplay)
      //this.updateChartDisplay();
    } else if (prevState.resultsToDisplay !== this.state.resultsToDisplay) {
      this.updateChartDisplay();
    }
  }


  render(){

    return(
      <div>
      <div className="contianerInfo">
        <div className="displaycheckBoxDiv">
          <div className="checkBox">
            <CheckBox countriesLabels={this.state.countriesLabel} handleChange={this.handleChange}  checked={this.state.checked}/>
            <div className="indicator">
              <SelectIndicator
              countriesLabels={this.state.countriesLabel}
              handleChange={this.changeIndicator} />
            </div>
          </div>
          </div>
          <div className="chartDiv">
          {
            this.state.infoToChart.length !== 0
            ?
            <div className="chartDisplay">
              <Chart dataRange={this.state.infoToChart} title={this.state.title} />
            </div>
            :
            <h1></h1>
          }

          </div>
        </div>
        <div className="newsFeed">
          <NewsFeed localSearch={this.getNews()}/>
        </div>
      </div>
    ) // render
  } // render
} //ChartCO2

export default ChartInfo
