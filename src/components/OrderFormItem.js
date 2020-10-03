// @flow
import React, { useState } from 'react'

export type OrderItemType = {
  amount: number,
  description: string,
}
type Props = {
  item: OrderItemType,
  onChangeSelection: (boolean) => void
}

export const OrderFormItem = (props: Props) => {

  return (
    <div className='field'>
      <div className='control'>
        <label className='checkbox' onChange={props.onChangeSelection}>
          <input type='checkbox' onChan/>
          <span> <b>{props.item.description}</b>: ${props.item.amount} </span>
        </label>
      </div>
    </div>
  )
}
