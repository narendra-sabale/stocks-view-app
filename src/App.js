import React, { useCallback, useState, Fragment } from 'react';
import RangeSelector from './components/actionControls/RangeSelector'
import ChartSelector from './components/actionControls/ChartSelector' 
import WatchList from './components/watchlist/WatchList'
import Chart from './components/charts/Chart'
import { DEFAULT_CHART, DEFAULT_RANGE, symbolMap } from './constants'
import { setLocalStorage } from './util/Util'
import './App.scss';

function App() {
  const [activeSymbol, setActiveSymbol] = useState('')
  const [activeChart, setActiveChart] = useState(DEFAULT_CHART)
  const [activeRange, setActiveRange] = useState(DEFAULT_RANGE)
  const [currentValueOfActiveSymbol, setCurrentValueOfActiveSymbol] = useState(0) 

  const handleSelectedSymbol = useCallback((symbol, value=0) => {
    setLocalStorage('activeSymbol', {active: symbol}) // storing selected symbol in localstorage, on refresh it will select by default
    setActiveSymbol(symbol) 
    setCurrentValueOfActiveSymbol(value)
  }, [])

  const handleRangeSelector = useCallback((range) => {
    setActiveRange(range)
  }, [])

  const handleChartSelector = useCallback((chart) => {
    setActiveChart(chart)
  }, [])

  const handleCurrentValueUpdate = useCallback((value)=>{
    setCurrentValueOfActiveSymbol(value)
  }, [])

  const getPercentValue = () => {
    const yesterdayPrice = symbolMap[activeSymbol]
    const percentage = ((currentValueOfActiveSymbol - yesterdayPrice) / yesterdayPrice) * 100
    const priceColor = currentValueOfActiveSymbol > yesterdayPrice ? 'green' : 'red'
    return (
      <span className={`${priceColor}`}>
        {`${percentage.toFixed(2)}%`}
      </span>
    )
  }

  // console.log("Active symbol :::::: " , activeSymbol)

  return (
    <div className="app">
      <div className="container">
        {/* <div className="header">
          Stocks View App
        </div> */}
        
        <div className="action-bar">
          <div className="project-name">Stocks View App</div>
          
          <div className="status">
          {
            !!activeSymbol && 
              <Fragment>
                <span className="current-value">{activeSymbol} : {currentValueOfActiveSymbol}</span>
                { 
                  (currentValueOfActiveSymbol > 0) &&
                    <span className="percentage">({getPercentValue()})</span>
                }
              </Fragment>
          }
          </div> 
          <div className="selector-container">
            <RangeSelector 
              activeRange={activeRange}
              handleRangeSelector={handleRangeSelector}/>
            <ChartSelector 
              activeChart={activeChart}
              handleChartSelector={handleChartSelector}/>
          </div>
        </div>
        
        <div className="main">
          <WatchList 
            activeSymbol={activeSymbol}
            currentValueOfActiveSymbol={currentValueOfActiveSymbol}
            handleSelectedSymbol={handleSelectedSymbol}
            />
          { !!activeSymbol 
            ? <Chart 
                activeSymbol={activeSymbol}
                activeChart={activeChart}
                activeRange={activeRange}
                handleCurrentValueUpdate={handleCurrentValueUpdate}/>
            : <div className="warning"> Watchlist is Empty. Please Add Symbol to watchlist </div>  
          }
        </div>
      </div>
    </div>
  );
}

export default App 
