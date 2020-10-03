import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import configs from '../configs';
import apiService from '../services/api-service';
import { OrderFormItem, OrderItemType } from './OrderFormItem';
import contributions from '../data/contributions';

export const CheckoutForm = () => {
  const [intentDidSucceed, setIntentDidSucceed] = useState(false);
  const [paymentDidSucceed, setPaymentDidSucceed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmitOrder = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    const purchase = [{ id: 'donation' }];
    apiService.post('/create-payment-intent', { purchase }, {})
      .then(() => {
      })
  }
  const handleSubmitPayment = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    const cardElement = elements.getElement(CardElement);

    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement
    });

    if (error) {
      console.log('[error]', error);
      return;
    }
    console.log('[PaymentMethod]', paymentMethod);
    
    setError(null);
    setLoading(true);
    
    return apiService.post("/create-payment-intent", {
      paymentMethod,
      amount: 2
    }, {})
      .then((json) => {
        setLoading(false);
        if (json.success) {
          setPaymentDidSucceed(true);
        } else {
          console.log(json);
        }
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      });
  };

  const onChangeOrderSelection = (isSelected: boolean, item) => {

  }

  return (
    <div>
    {!intentDidSucceed ?
      <div className='order-form' >
        <h2 className='subtitle is-3'>Choose your contribution</h2>
        <form onSubmit={handleSubmitOrder}>
          {contributions.map((item) => 
            <OrderFormItem
              item={item}
              onChangeSelection={onChangeOrderSelection}
            />)}
        </form>
      </div> : <div className='checkout-form'>
      {!paymentDidSucceed ? <form onSubmit={handleSubmitPayment}>
        <h2 className='subtitle is-3'>Payment Method</h2>
        <label>
          Card details
          <CardElement
          />
        </label>
        <button
          className={`button is-fullwidth is-primary ${loading ? 'is-loading' : ''}`} 
          type="submit"
          disabled={!stripe}>
          Pay
        </button>
      </form> : <div>
        <p className='is-success'>Success!</p>
      </div>}
    </div>}
    </div>
  );
};
