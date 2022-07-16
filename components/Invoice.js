import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';

export default function Invoice({route}) {
  const data = route.params.data;
  
  const percentage =
    data.d_percentage === '' || data.d_percentage === null
      ? 0
      : parseFloat(data.d_percentage);
  var discount = data.packageprice * (percentage / 100);
  discount = discount.toFixed(2);
  var tax =
    data.d_percentage === ''
      ? parseFloat(data.price) * 0.18
      : (parseFloat(data.packageprice) - discount) * 0.18;
  tax = tax.toFixed(2);
  var price = parseFloat(data.price).toFixed(2);

  function inWords(price) {
    //console.log(price);
    var a = [
      '',
      'One ',
      'Two ',
      'Three ',
      'Four ',
      'Five ',
      'Six ',
      'Seven ',
      'Eight ',
      'Nine ',
      'Ten ',
      'Eleven ',
      'Twelve ',
      'Thirteen ',
      'Fourteen ',
      'Fifteen ',
      'Sixteen ',
      'Seventeen ',
      'Eighteen ',
      'Nineteen ',
    ];
    var b = [
      '',
      '',
      'Twenty',
      'Thirty',
      'Forty',
      'Fifty',
      'Sixty',
      'Seventy',
      'Eighty',
      'Ninety',
    ];
    var number = parseFloat(price).toFixed(2).split('.');
    var num = parseInt(number[0]);
    var digit = parseInt(number[1]);
    //console.log(num);
    if (num == 0) return 'Zero Only';
    if (num.toString().length > 9) return 'overflow';
    var n = ('000000000' + num)
      .substr(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    var d = ('00' + digit).substr(-2).match(/^(\d{2})$/);
    if (!n) return;
    var str = '';
    str +=
      n[1] != 0
        ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore '
        : '';
    str +=
      n[2] != 0
        ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh '
        : '';
    str +=
      n[3] != 0
        ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand '
        : '';
    str +=
      n[4] != 0
        ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred '
        : '';
    str +=
      n[5] != 0
        ? (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Rupees '
        : '';
    str +=
      d[1] != 0
        ? (str != '' ? 'and ' : '') +
          (a[Number(d[1])] || b[d[1][0]] + ' ' + a[d[1][1]]) +
          'Paise Only'
        : 'Only';
    return str;
  }

  const RsInWords = inWords(parseFloat(data.price));

  const HTMLView = `
<link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
<script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<style>

#invoice{
padding: 30px;
}

.invoice {
position: relative;
background-color: #FFF;
min-height: 680px;
padding: 15px;
}

.invoice header {
padding: 10px 0;
margin-bottom: 20px;
border-bottom: 1px solid #3989c6
}

.invoice .company-details {
text-align: right
}

.invoice .company-details .name {
margin-top: 0;
margin-bottom: 0
}

.invoice .contacts {
margin-bottom: 20px;
border-bottom: 1px solid #3989c6;
}

.invoice .invoice-to {
text-align: left
}

.invoice .invoice-to .to {
margin-top: 0;
margin-bottom: 0
}

.invoice .invoice-details {
text-align: right
}

.invoice .invoice-details .invoice-id {
margin-top: 0;
color: #3989c6
}

.invoice main {
padding-bottom: 50px
}

.invoice main .thanks {
margin-top: -100px;
font-size: 2em;
margin-bottom: 50px
}

.invoice main .notices {
padding-left: 6px;
border-left: 6px solid #3989c6
}

.invoice main .notices .notice {
font-size: 1.2em
}

.invoice table {
width: 100%;
border-collapse: collapse;
border-spacing: 0;
margin-bottom: 20px
}

.invoice table td,.invoice table th {
padding: 15px;
background: #eee;
border-bottom: 1px solid #fff
}

.invoice table th {
white-space: wrap;
font-weight: 400;
font-size: 16px
}

.invoice table td h3 {
margin: 0;
font-weight: 400;
color: #3989c6;
font-size: 1.2em
}

.invoice table .qty,.invoice table .total,.invoice table .unit {
text-align: center;
font-size: 1em
}

.invoice table .no {
color: #fff;
font-size: 1.6em;
background: #3989c6
}

.invoice table .unit {
background: #ddd
}

.invoice table .total {
background: #3989c6;
color: #fff
}

.invoice table tbody tr:last-child td {
border: none
}

.invoice table tfoot td {
background: 0 0;
border-bottom: none;
white-space: nowrap;
text-align: right;
padding: 10px 20px;
font-size: 1.2em;
border-top: 1px solid #aaa
}

.invoice table tfoot tr:first-child td {
border-top: none
}

.invoice table tfoot tr:last-child td {
color: #3989c6;
font-size: 1.4em;
/*border-top: 1px solid #3989c6*/
}

.invoice table tfoot tr td:first-child {
border: none
}

.invoice footer {
width: 100%;
text-align: center;
color: #777;
border-top: 1px solid #aaa;
padding: 8px 0
}


</style>

<body>
<div id="invoice">
<div class="invoice overflow-auto">
  <div style="min-width: 600px">
      <header>
          <div class="row">
              <div class="col">
                  <a >
                      <img src="https://booksinvoice.com/logo.jpg" data-holder-rendered="true" style="width: 100;" />
                      </a>
              </div>
              <div class="col company-details">
                  <div>Agastya Voice And Infotainment Services Pvt. Ltd.</div>
                  <div>Plot No. 121, Vandana Nagar, Amkhera Road,</div>
                  <div>Gohalpur Jabalpur-482001, Madhya Pradesh, India</div>
              </div>
          </div>
      </header>
      <main>
    <div class="row contacts">
        <div class="col invoice-to">
            <div class="address">GST- 23AAPCA1066Q1ZA</div>
            <div class="email">Order No.: ${data.oid}</div>
        </div>
        <div class="col invoice-details">
            <div class="date">Date of Invoice: ${
              new Date(data.valid_from).getDate() +
              '-' +
              (new Date(data.valid_from).getMonth() + 1) +
              '-' +
              new Date(data.valid_from).getFullYear()
            }</div>
            <div class="date">Invoice No: ${data.id}</div>
        </div>
    </div>
    <div class="row contacts">
        <div class="col invoice-to">
            <div class="address">Billing Address</div>
            <div class="email">
                <p style='margin-bottom: 0rem;'>${data.username}</p>
                <p style='margin-bottom: 0rem;'>${data.address}</p>
                
                <p style='margin-bottom: 0rem;'>${data.zip_pin}</p>
                <p style='margin-bottom: 0rem;'>${data.email} ${
    data.telephone
  }</p>
            </div>
        </div>
        
    </div>
    <table border="0" cellspacing="0" cellpadding="0">
        <thead>
            <tr>
                <th>Subscription Type</th>
                <th class="text-left">Subscription Details</th>
                <th class="text-right">MRP/Package Price</th>
                <th class="text-right">Validity</th>
                <th class="text-right">Discount Price</th>
                ${
                  parseInt(data.no_of_copies) > 1
                    ? `<th class="text-right">Copies</th>`
                    : ``
                }
                <th class="text-right">Taxable Value</th>
                ${
                  data.currency === 'INR'
                    ? `<th class="text-right">CGST</th>
                  <th class="text-right">SGST</th>`
                    : `<th class="text-right">IGST</th>`
                }
                <th class="text-right">Amount (Rs)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="unit" style='text-transform: capitalize;'>${
                  data.user_type
                }</td>
                
                <td class="unit">${data.packagename}</td>	
                <td class="unit">${data.currency === 'INR' ? 'Rs.' : '$'} ${
    data.packageprice
  }</td>
                <td class="unit">${data.days} Days</td>
                
                <td class="unit">Rs ${discount}</td>
                ${
                  parseInt(data.no_of_copies) > 1
                    ? `<td class="unit">${data.no_of_copies}</td>`
                    : ``
                }
                <td class="unit">Rs ${tax}</td>
                ${
                  data.currency === 'INR'
                    ? `<td class="unit">9 %</td>
                <td class="qty">9 %</td>`
                    : `<td class="unit">18 %</td>`
                }
                <td class="total">${
                  data.currency === 'INR' ? 'Rs.' : '$'
                } ${price}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="6"></td>
                <td >TOTAL</td>
                <td colspan="2">Rs. ${price}</td>
            </tr>
        </tfoot>
    </table>
    <div style="display: flex; justify-content: space-between">
    <div class="notices" style='text-align: start;'>
        
        <div class="notice">Amount Chargeable (in Words):
        <br>
         <b>${RsInWords}</b>
            <br>
            Declaration: We declare that this invoice shows the actual Price of the subscription described above that all particulars are true and correct. All disputes are subject to Madhya Pradesh, Jabalpur Jurisdiction only.
            <br>
            <br>
            Subscriber Acknowledgement.
            <br>
            I, <b>${
              data.username
            }</b> confirm that the said services are being subscribed for my personal use and not for re-subscribe.
        </div>
    </div>
    <div class="notices" style='width: 15%;height: 15%;border-left: none;'>
        <span>Authorized Signature</span>
        <br>
        <br>
        <img src='https://booksinvoice.com/uploads/signature1.png' alt='img' data-holder-rendered="true" style="width: 100;">
    </div>
    </div>
</main>
<footer>
    <p>*This is a computer generated invoice and does not require a physical signature</p>
    <p>If You have any questions. feel free to call customer care at +91-7588986868 or use Help section in our website www.booksinvoice.com</p>
</footer>
</div>
<div></div>
</div>
</div>
      </body>
      `;

  return (
    //<View style={styles.container}>
    <WebView
      originWhitelist={['*']}
      source={{
        html: HTMLView,
      }}
    />
    //</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
