import React from 'react'
import "./ProductClickable.scss"

const ProductClickable = (cellData) => {
  console.log(cellData)
  return (
    <div>{cellData.displayValue}</div>
  )
}

export default ProductClickable