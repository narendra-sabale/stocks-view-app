import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { config } from './chartConfig' 
import { fetchLiveData, formatData } from '../../util/Util'
import { LIVE_CHART_UPDATE_TIME } from '../../constants'

const Line = ({ data, activeSymbol, activeRange, handleCurrentValueUpdate }) => {
  const chartElementRef = useRef()
  const chart = useRef()
  const lineSeries = useRef() 
  const intervalRef = useRef()
  const resizeObserver = useRef()

  useEffect(()=>{
    chart.current = createChart(chartElementRef.current, config());
    resizeObserver.current = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      chart.current.applyOptions({ width, height });
      setTimeout(() => {
        chart.current.timeScale().fitContent();
      }, 0);
    });
    resizeObserver.current.observe(chartElementRef.current);

    setChartData()

    return () => {
      cleanup()
      resizeObserver.current.disconnect()
    }
  }, [])

  useEffect(()=>{
    // console.log("STATE :: >>>>>>>>>>>>>>", chart.current)  
    chart.current.removeSeries(lineSeries.current)
    cleanup()
    setChartData()
  }, [data])

  const setChartData = () => {
    lineSeries.current = chart.current.addLineSeries({title: activeSymbol});
    chart.current.timeScale().fitContent();
    
    if (activeRange === '1Y' || activeRange === 'All') {
      chart.current.applyOptions({ timeScale: { timeVisible: false }});
    } else if(activeRange === '1M') {
      chart.current.applyOptions({ timeScale: { rightOffset: 5, timeVisible: false }});
    } else {
      chart.current.applyOptions({ timeScale: { rightOffset: 5, timeVisible: true }});
    } 

    lineSeries.current.setData(data);
    getLiveData()
  }

  const getLiveData = () => {
    // let counter = 50
    intervalRef.current = setInterval(() => {
      // counter--
      let testdata = fetchLiveData(activeSymbol, activeRange)
      if(testdata !== null) {
        testdata = formatData([testdata])[0]
        // console.log("TEST DATA Line Chart", testdata)
        if(activeRange === 'Live') { // then only update on chart
          lineSeries.current.update(testdata)
        } 
        handleCurrentValueUpdate(testdata.value)
      }
      // if (counter <= 0) {
      //   cleanup()
      // }
    }, LIVE_CHART_UPDATE_TIME)
  }

  const cleanup = () => {
    intervalRef.current && clearInterval(intervalRef.current)
  }

  return (
    <div ref={chartElementRef} style={{width: '100%', height:'100%'}} />
  );
}

export default Line
