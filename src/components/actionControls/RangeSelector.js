import React, { memo } from 'react';
import { RANGE_VALUES } from '../../constants'
import './styles/RangeSelector.scss'

const RangeSelector = ({ activeRange, handleRangeSelector }) => {

  const handleRange = (e) => {
    console.log(e.target.id)
    const activeRange = e.target.id
    handleRangeSelector(activeRange)
  }

  console.log("rendered Range ----->")

  return (
    <div className="range-selector">
      {
        RANGE_VALUES.map((range, index) => 
          <div 
            key={`${range}_${index}`} 
            id={range}
            className={`range ${range === activeRange ? 'active' : '' }`}
            onClick={handleRange}>
            {range}
          </div>
        )
      }
    </div>
  )
}

export default memo(RangeSelector)