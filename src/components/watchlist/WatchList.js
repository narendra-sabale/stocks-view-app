import React, { memo, useState, useCallback, useEffect } from 'react';
import AddSymbol from '../../components/actionControls/AddSymbol'
import { getRandomNumber, setLocalStorage, getLocalStorage } from '../../util/Util'
import './styles/WatchList.scss'

const WatchList = ({ activeSymbol, currentValueOfActiveSymbol, handleSelectedSymbol }) => {
  const [symbolList, setSymbolList] = useState({...getLocalStorage('watchlist')} || {}) 

  useEffect(()=>{ // if local storage contains symbols then selecting 1st symbol by default
    const list = Object.keys(symbolList)
    if(list.length > 0) {
      const activeSymbol = getLocalStorage('activeSymbol')
      handleSelected(activeSymbol.active)
    }
  }, [])

  useEffect(()=>{
    // console.log("Curreunt Value ", currentValueOfActiveSymbol)
    const updatedList = Object.keys(symbolList).reduce((accumulater, current) => {
      if (current === activeSymbol) {
        accumulater[current] = currentValueOfActiveSymbol
      } else {
        const value = symbolList[current]
        accumulater[current] = Number(getRandomNumber( value-5, value+5 )) + Number(Math.random().toFixed(2))
      }
      return accumulater
    }, {})

    setSymbolList({...updatedList})
  }, [currentValueOfActiveSymbol])

  const handleAddSymbol = useCallback((symbol, value) => { // if symbol already present then don't add
    // console.log("SYM :: ", symbol, )
    if(!symbolList.hasOwnProperty(symbol)) {
      setSymbolList(prevSymbolList => {
        const list = { [symbol]: value, ...prevSymbolList }
        setLocalStorage('watchlist', list) // add to local storage
        return list
      })
      const list = Object.keys(symbolList)
      if(list.length === 0) { // selecting symbol on adding if list empty 
        handleSelected(symbol) 
      }
    }
  }, [symbolList])

  const handleRemovedSymbol = useCallback((e, symbol) => {
    // console.log("EVEE ::: ", e, symbol)
    e.stopPropagation()
    const updatedList = Object.keys(symbolList).reduce((accumulater, current) => {
      if (current !== symbol) {
        accumulater[current] = symbolList[current]
      }
      return accumulater
    }, {})

    if(activeSymbol === symbol) { // if selected symbol removed 
      const list = Object.keys(updatedList)
      if(list.length > 0) { // selecting 1st symbol 
        handleSelected(list[0]) 
      } else {
        handleSelectedSymbol('', 0) // if list empty then resetting active Symbol and removing chart
      }
    }

    setLocalStorage('watchlist', updatedList) // add to local storage
    setSymbolList({...updatedList})
  }, [symbolList, activeSymbol])

  const handleSelected = (symbol) => {
    handleSelectedSymbol(symbol, symbolList[symbol])
  }
 
  // console.log("rendered Stock List ----->")

  return (
    <div className="stock-list">
      <div className="heading">Watchlist</div>
      <AddSymbol handleAddSymbol={handleAddSymbol}/> 
      <div className="list">
        {
          Object.entries(symbolList).map(([symbol, value], index) => {
            return (             
              <div 
                className={`symbol ${symbol === activeSymbol ? 'active-symbol' : ''}`} 
                key={`${symbol}`} 
                onClick={()=>handleSelected(symbol)}>
                  <div className="name">{symbol}</div>
                  <div className="value">{value}</div>
                  <div className="remove" onClick={(e)=>handleRemovedSymbol(e, symbol)}>X</div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}


export default memo(WatchList)