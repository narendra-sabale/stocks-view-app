import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { config } from './chartConfig' 
import { fetchLiveData } from '../../util/Util'
import { LIVE_CHART_UPDATE_TIME } from '../../constants'

const Candle = ({ data, activeSymbol, activeRange, handleCurrentValueUpdate }) => {
  const chartElementRef = useRef()
  const chart = useRef()
  const candleSeries = useRef() 
  const intervalRef = useRef()

  useEffect(() => {
    chart.current = createChart(chartElementRef.current, config());
    setChartData()

    return ()=>{
      cleanup()
    }
  }, []);

  useEffect(()=>{
    console.log("STATE :: >>>>>>>>>>>>> ", chart.current)
    
    chart.current.removeSeries(candleSeries.current)
    cleanup()
    setChartData()
  }, [data])

  const setChartData = () => {
    candleSeries.current = chart.current.addCandlestickSeries({title: activeSymbol});
    chart.current.timeScale().fitContent();
    
    if (activeRange === '1Y' || activeRange === 'All') {
      chart.current.applyOptions({ timeScale: { timeVisible: false }});
    } else if(activeRange === '1M') {
      chart.current.applyOptions({ timeScale: { rightOffset: 5, timeVisible: false }});
    } else {
      chart.current.applyOptions({ timeScale: { rightOffset: 5, timeVisible: true }});
    } 

    candleSeries.current.setData(data);
    getLiveData()
  }

  const getLiveData = () => {
    let counter = 50
    intervalRef.current = setInterval(() => {
      counter--
      let testdata = fetchLiveData(activeSymbol, activeRange)
      
      console.log("TEST DATA Candle Chart", testdata)
      
      if(activeRange === 'Live') { // then only update on chart
        candleSeries.current.update(testdata)
      } 
      handleCurrentValueUpdate(testdata.close)
      if (counter <= 0) {
        cleanup()
      }
    }, LIVE_CHART_UPDATE_TIME)
  }

  const cleanup = () => {
    intervalRef.current && clearInterval(intervalRef.current)
  }

  console.log("CANDLE RENDER ------->", data)
  
  return (
    // <div>Candle Chart</div>
      <div ref={chartElementRef} style={{width: '100%', height:'100%'}} />
  );
}

export default Candle
