
// import { dayData, monthData, yearData } from '../data/data'
import { symbolMap } from '../constants'
import moment from 'moment'

let data = [] // act as closure

export const fetchData_1 = (symbol, range) => { //this can be replaced with actual API
  return new Promise(resolve => {
    let data = []
      switch(range) {
        case '1D' : data = generateDayData(symbolMap[symbol], 50); // priceRange, daysData
                    break; 
        case '1M' : data = generateMonthsData(symbolMap[symbol], 24); // priceRange, monthsData
                    break;
        case '1Y' : data = generateYearsData(symbolMap[symbol], 7); // priceRange, yearsData 
                    break;
        default: data = generateDayData(symbolMap[symbol], 7);;
      }
      resolve(data);
  });
}

/////
export const fetchData = (symbol, range) => { // keepiing same data while range change
  return new Promise(resolve => {
      let returnData = [] 
      switch(range) {
        case '1D' : returnData = data.slice(data.length - 180)// daysData, priceRange //180 for each min for 2 hr
                    break; 
        case '1M' : returnData = data.slice(1826-50, 1826); // monthsData in days, priceRange //1826 daily entries & 6 months = 180
                    break;
        case '1Y' : returnData = data.slice( 1826-(1826/5), 1826); // yearsData, priceRange  5yers data
                    break;
        case 'All': returnData = data.slice(0, 1826); // yearsData, priceRange 
                    break;          
        default: returnData = data.slice(data.length - 100);
      }
      resolve(returnData);
  });
}

export const fetchLiveData = (symbol) => {
  let currentTimeStamp = moment().unix()
  let value = symbolMap[symbol]
  value = getRandomNumber(value-5, value+10)

  const liveData = generator(0, 1, value)
  liveData.time = currentTimeStamp

  if(data[data.length-1].time === currentTimeStamp){
    // console.log("MATCH FOUND $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ LIVE UPDATE")
    return null //return if same timestamp generated
  }

  data.push(liveData) //data push to maintain incremental values while switching to Range(live/1m/1y/all)
  
  return liveData
}

// using this method to generate all data and swiching range passing that range data instead of creating random data on range change
export const generateAllData = (symbol, noOfYears=5) => {
  const period = 1
  const size = noOfYears * parseInt(365/period)
  let valueDecrement = symbolMap[symbol]
  data = generateData(size, period, valueDecrement) //generation day by day data
  // console.log("% yesr size = ", data.length)

  // generating timestamp data
  const hrData = []
  const hrDataForEachSeconds = 180 // 3 hr data for 1 min

  let currentTimeStamp = moment().unix()

  hrData.push({
    time: currentTimeStamp,
    close: valueDecrement, 
    open: valueDecrement-2, 
    high: valueDecrement+3, 
    low: valueDecrement-5
  })

  for(let j=1; j<hrDataForEachSeconds; j++){
    if((j%5 === 0) && (valueDecrement > 15)) {
      valueDecrement = valueDecrement - (Math.random() > 0.5 ? 5 : -3)
    }
    currentTimeStamp = currentTimeStamp - 60
    const obj = generator(j, period, valueDecrement)
    obj.time = currentTimeStamp

    if(hrData[hrData.length-1].time === currentTimeStamp){
      // console.log("MATCH FOUND $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
      currentTimeStamp = currentTimeStamp - 60
      obj.time = currentTimeStamp
    }

    hrData.push(obj)
  }

  data = data.concat(hrData.reverse())
  // console.log("% yesr size = ", data.length)
} 

//////

export const formatData = (data) => { //for lineChart 
  return data.map((details => {
    return {
      time: details.time, 
      value: details.close
    }
  }))
}

export const generator = (i, period=1, value) => {
  const time = moment().subtract(period * i, 'days').format('YYYY-MM-DD')
  const sign = true
  let close = value + getRandomNumberInDecimal(5, sign)
  let open = value + getRandomNumberInDecimal(5, sign)
  close = Number(close.toFixed(2))
  open = Number(open.toFixed(2))

  let high = (open>close) ? open + Math.random() : close + Math.random()
  high = Number(high.toFixed(2))
  let low = (open>close) ? close - Math.random() : open - Math.random()
  low = Number(low.toFixed(2))
  
  // console.log("Test 123 =====>>", time, high, close, open, low)
  return {time, close, open, high, low}
}

export const generateData = (size, period, value=100) => {
  const data = []
  data.push({
    time: moment().format('YYYY-MM-DD'), 
    close: value, 
    open: value-2, 
    high: value+3, 
    low: value-5
  })

  let valueDecrement = value
  for(let i=1; i<=size; i++){
    if((i%5 === 0) && (valueDecrement > 15)) {
      valueDecrement = valueDecrement - (Math.random() > 0.5 ? 5 : -3)
    }
    const obj = generator(i, period, valueDecrement)
    data.push(obj)
  }
  return data.reverse()
}

export const generateYearsData = (value, noOfYears=5) => {
  const period = 7
  const size = noOfYears * parseInt(365/period) // generating 5 days period of data  
  return generateData(size, period, value)
} 

export const generateMonthsData = (value, noOfMonths=12) => {
  const period = 3
  const size = noOfMonths * parseInt(365/period) // generating 3 days period of data  
  return generateData(size, period, value)
} 

export const generateDayData = (value, noOfDays=30) => {
  const period = 1
  const size = noOfDays // generating per day data
  return generateData(size, period, value)
}

export const getRandomNumber = (min, max) => { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getRandomNumberInDecimal = (range, sign=false) => { // generate +ve/-ve Number from 0 to given range 
  const precision = 100
  const val = Math.floor(Math.random() * (range * precision - 1 * precision) + 1 * precision) / (1*precision);
  if(sign){
    const sign = Math.random() < 0.5 ? -1 : 1
    return sign * val
  }
  return val
}


export const setLocalStorage = (key, data) => {
  // console.log("LOCAL DATA :: ", data)
  localStorage.setItem(key, JSON.stringify(data))
}

export const getLocalStorage = (key) => {
  let data = localStorage.getItem(key)
  data = JSON.parse(data)
  // console.log("LOCAL DATA GET:: ", data)
  return data
}