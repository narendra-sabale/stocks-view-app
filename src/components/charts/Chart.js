
import React, { memo, useState, useEffect, useCallback } from 'react';
import Candle from '../../components/charts/Candle'
import Line from '../../components/charts/Line'
import { fetchData, formatData, generateAllData } from '../../util/Util'
import './styles/Chart.scss'

const Chart = ({ activeSymbol, activeChart, activeRange, handleCurrentValueUpdate }) => {
  // console.log("CHART :: ", activeChart)
  const [data, setData] = useState([])

  useEffect(async () => {
    // console.log("GENERATOR +++++++++++++++++++++++++>>>>>>>>>>>")
    await generateAllData(activeSymbol)
  }, [activeSymbol])

  useEffect(() => {
    async function loadData () {
      return await fetchData(activeSymbol, activeRange)
    }
    
    loadData().then((data) => {
      // console.log("Returned DATA ::: +++ ", data, JSON.stringify(data))
      setData([...data])
    })  
  }, [activeRange, activeSymbol])


  const renderChart = useCallback(() => {
    // console.log("changed data")
    switch(activeChart) {
      case 'Line': return (
                    <Line 
                      data={formatData(data)} 
                      activeSymbol={activeSymbol}
                      activeRange={activeRange}
                      handleCurrentValueUpdate={handleCurrentValueUpdate}/>
                    )
      case 'Candle': return (
                      <Candle 
                        data={data} 
                        activeSymbol={activeSymbol}
                        activeRange={activeRange}
                        handleCurrentValueUpdate={handleCurrentValueUpdate}/>
                      )
      default: return (
                <Line 
                  data={formatData(data)} 
                  activeSymbol={activeSymbol}
                  activeRange={activeRange}
                  handleCurrentValueUpdate={handleCurrentValueUpdate}/>
                )
    }
  }, [activeChart, data])

  return (
    <div className="chart"> 
      {renderChart()} 
    </div>
  )
}

export default memo(Chart)
