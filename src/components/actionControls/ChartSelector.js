import React, { memo } from 'react';
import { CHART_VALUES } from '../../constants'
import './styles/ChartSelector.scss'

const ChartSelector = ({ activeChart, handleChartSelector }) => {

  const handleChart = (e) => {
    // console.log("VAL :: ", e.target.value)
    const activeChart = e.target.value
    handleChartSelector(activeChart)
  }

  // console.log("rendered Chart ----->")

  return(
    <div className="chart-selector">
      <select value={activeChart} onChange={handleChart}>
        {
          CHART_VALUES.map((chart, index) => 
            <option key={`${chart}_${index}`}>
              {chart}
            </option>
          )
        }
      </select>
    </div>
  )
}

export default memo(ChartSelector)
 
