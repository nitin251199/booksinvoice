import React from 'react';
import WebView from 'react-native-webview';

export const PaymentScreen = ({route}) => {
  const paymentDetails = route.params.paymentDetails;

  let urlEncodedData = '',
  urlEncodedDataPairs = [],
  key;
for (key in paymentDetails) {
  urlEncodedDataPairs.push(
    encodeURIComponent(key) + '=' + encodeURIComponent(paymentDetails[key]),
  );
}
urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

  var formData = new FormData();
  formData.append('amount', paymentDetails.amount);
  formData.append('billing_address', paymentDetails.billing_address);
  formData.append('billing_email', paymentDetails.billing_email);
  formData.append('billing_name', paymentDetails.billing_name);
  formData.append('billing_tel', paymentDetails.billing_tel);
  formData.append('billing_zip', paymentDetails.billing_zip);
  formData.append('cancel_url', paymentDetails.cancel_url);
  formData.append('currency', paymentDetails.currency);
  formData.append('customer_identifier', paymentDetails.customer_identifier);
  formData.append('language', paymentDetails.language);
  formData.append('merchant_id', paymentDetails.merchant_id);
  formData.append('order_id', paymentDetails.order_id);
  formData.append('promo_code', paymentDetails.promo_code);
  formData.append('redirect_url', paymentDetails.redirect_url);
  formData.append('tid', paymentDetails.tid);

  return (
    <WebView
      javaScriptEnabled
      originWhitelist={['*']}
      source={{
        uri: 'https://booksinvoice.com/Cart/getRedirectToCcAvenu/',
        method: 'POST',
        body: urlEncodedData,
      }}
    />
  );
};
