import React, { memo, useState, useCallback, useEffect } from 'react';
import AddSymbol from '../../components/actionControls/AddSymbol'
import { getRandomNumber, setLocalStorage, getLocalStorage, getRandomNumberInDecimal } from '../../util/Util'
import { symbolMap } from '../../constants'
import './styles/WatchList.scss'

const WatchList = ({ activeSymbol, currentValueOfActiveSymbol, handleSelectedSymbol }) => {
  const [symbolList, setSymbolList] = useState({...getLocalStorage('watchlist')} || {}) 

  // useEffect(()=>{
  //   // setSymbolList()
  //   console.log("LOCAL DATA ===> ",{...getLocalStorage('watchlist')})
  // },[])

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

    if(activeSymbol === symbol) { // if selected symbol removed then resetting active Symbol and removing chart
      handleSelectedSymbol('', 0)
    }
    setLocalStorage('watchlist', updatedList) // add to local storage
    setSymbolList({...updatedList})
  }, [symbolList, activeSymbol])

  const handleSelected = (symbol) => {
    handleSelectedSymbol(symbol, symbolList[symbol])
  }
 
  console.log("rendered Stock List ----->")

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