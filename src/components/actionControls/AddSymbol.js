import React, { useCallback, useState, memo } from 'react';
import { symbolMap } from '../../constants'
import './styles/AddSymbol.scss'

const AddSymbol = ({ handleAddSymbol }) => {
  const [currentSymbol, setCurrentSymbol] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const handleSymbolInput = useCallback((e) => {
    const value = e.target.value.trim()
    const newSuggestions = value ? Object.keys(symbolMap).filter(symbol=>symbol.toLowerCase().includes(value.toLowerCase())) : []
    setCurrentSymbol(value)
    setSuggestions([...newSuggestions])
  }, [])

  const handleSymbolAdd = (symbol) => {
    if(currentSymbol) {
      handleAddSymbol(symbol, symbolMap[symbol])
      setCurrentSymbol('')
      setSuggestions([])
    }
  }

  const handleClearInput = () => {
    if(currentSymbol) {
      setCurrentSymbol('')
      setSuggestions([])
    }
  }

  console.log("rendered Input Symbol----->")

  return (
    <div className="input-wrapper">
      <input 
        placeholder="Search Symbol..."
        value={currentSymbol} 
        onChange={handleSymbolInput}/>

      <div className="suggestion-wrapper">
        {
          suggestions.map((symbol)=>{
            return (
              <div key={symbol} className="suggestion-box">
                <div>{symbol}</div>
                <div className="add-btn" onClick={()=>handleSymbolAdd(symbol)}>
                  Add
                </div>
              </div>
            )
          })
        } 
      </div>

      <div className="clear-btn" onClick={handleClearInput}>
        X
      </div>
    </div>
  )
}

export default memo(AddSymbol)