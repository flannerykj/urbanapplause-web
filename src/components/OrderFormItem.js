// @flow
import React, { useState } from 'react'

export type OrderItemType = {
  amount: number,
  description: string,
}
type Props = {
  item: OrderItemType,
  onSelect: () => void
}

export const OrderFormItem = (props: Props) => {

  return (
    <div className='box selectable-box' onClick={props.onSelect}>
      <div className='columns'>
        <div className='column is-one-fifth'>
          <h4 className='title is-4'>${props.item.amount}</h4>
        </div>

        <div className='column'>
          <p>{props.item.description} </p>
        </div>
      </div>
    </div>
  )
}
