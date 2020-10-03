import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { Elements, CardNumberElement, CardCVCElement, CardExpiryElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import configs from '../configs';
import { CheckoutForm } from '../components/CheckoutForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

class DonationPage extends Component {
  render() {
    return(
      <div>
        <h1 className='title is-1'>Donate</h1>
        <h2 className='subtitle is-2'></h2>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    )
  }
}


export default DonationPage;
