// @flow 
import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Elements, CardNumberElement, CardCVCElement, CardExpiryElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import configs from '../configs';
import { CheckoutForm } from '../components/CheckoutForm';
import copy from '../copy';
import type { SettingsState } from '../types/store';

type Props = {
  settings: SettingsState
}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

class DonationPage extends Component<Props> {
  render() {

    const lang = this.props.settings.languagePref;
    return(
      <div>
        <h1 className='title is-1'>{copy['contribute-page-title'][lang]}</h1>
        <h2 className='subtitle is-2'></h2>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    )
  }
}


export default connect((appState) => ({ settings: appState.settings }))(DonationPage);
