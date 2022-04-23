// Print HTML as a Document from React Native App for Android and iOS
// https://aboutreact.com/react-native-print-html/

// Import React
import React, {useState} from 'react';
// Import required components
import {WebView} from 'react-native-webview';
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

// Import HTML to PDF
import RNHTMLtoPDF from 'react-native-html-to-pdf';
// Import RNPrint
import RNPrint from 'react-native-print';
import {ThemeContext} from './ThemeContext';

const {width, height} = Dimensions.get('window');

const Invoice = ({route}) => {
  //   console.log("invoice",route.params.body,route.params.userdata)
  //   const[userData,setUserData]=useState(route.params.userdata)
  //   const[shop,setShop]=useState(route.params.body)

  const {theme} = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  const [selectedPrinter, setSelectedPrinter] = useState(null);

  const data = route.params.item;

  // Only for iOS
  const selectPrinter = async () => {
    const selectedPrinter = await RNPrint.selectPrinter({x: 100, y: 100});
    setSelectedPrinter(selectedPrinter);
  };

  // Only for iOS
  const silentPrint = async () => {
    if (!selectedPrinter) {
      alert('Must Select Printer First');
    }
    const jobName = await RNPrint.print({
      printerURL: selectedPrinter.url,
      html: '<h1>Silent Print clicked</h1>',
    });
  };

  const printHTML = async () => {
    await RNPrint.print({
      html: HTMLView,
    });
  };

  var a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
  var b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
  
  function inWords (num) {
      if ((num = num.toString()).length > 9) return num;
      n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n) return; var str = '';
      str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
      str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
      str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
      str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
      str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
      return str;
  }

const RsInWords = inWords(parseInt(data.price));

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
                      <a target="_blank" href="https://lobianijs.com">
                          <img src="https://booksinvoice.com/logo.jpg" data-holder-rendered="true" style="width: 100;" />
                          </a>
                  </div>
                  <div class="col company-details">
                      <h2 class="name">
                          Arboshiki
                      </h2>
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
                <div class="email"><a href="#">Order No.: ${data.oid}</a></div>
            </div>
            <div class="col invoice-details">
                <div class="date">Date of Invoice: ${data.valid_from}</div>
                <div class="date">Invoice No: </div>
            </div>
        </div>
        <div class="row contacts">
            <div class="col invoice-to">
                <div class="address">Billing Address</div>
                <div class="email">
                    <p style='margin-bottom: 0rem;'>Username</p>
                    <p style='margin-bottom: 0rem;'>Address</p>
                    
                    <p style='margin-bottom: 0rem;'>Zip pin</p>
                    <p style='margin-bottom: 0rem;'>Email contact no</p>
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
                    <th class="text-right">Taxable Value</th>
                    <th class="text-right">CGST</th>
                    <th class="text-right">SGST</th>
                    <th class="text-right">Amount (Rs)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="unit" style='text-transform: capitalize;'>User Type</td>
                    
                    <td class="unit">${data.packagename}</td>	
                    <td class="unit">${data.currency === 'INR' ? 'Rs.' : '$'} ${data.price}</td>
                    <td class="unit">${data.days} Days</td>
                    
                    <td class="unit">Rs discount</td>
                    <td class="unit">Rs </td>
                    <td class="unit">unit</td>
                    <td class="qty">qty</td>
                    <td class="total">Total</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="6"></td>
                    <td colspan="2">TOTAL</td>
                    <td>Rs. </td>
                </tr>
            </tfoot>
        </table>
        <div style="display: flex;">
        <div class="notices" style='width: 85%;text-align: start;'>
            
            <div class="notice">Amount Chargeable (in Words): <b>${RsInWords}</b>
                <br>
                Declaration: We declare that this invoice shows the actual Price of the subscription described above that all particulars are true and correct. All disputes are subject to Madhya Pradesh, Jabalpur Jurisdiction only.
                <br>
                Subscriber Acknowledgement.
                <br>
                I CustomerName Confirm that the said services are being subscribed for my personal use and not for re-subscribe.
            </div>
        </div>
        <div class="notices" style='width: 15%;border-left: none;'>
            <img src='dd' alt='img'>
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

  const printPDF = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: HTMLView,
      fileName: 'invoice',
      base64: true,
    });
    await RNPrint.print({filePath: results.filePath});
  };

  const customOptions = () => {
    return (
      <View>
        {selectedPrinter && (
          <View>
            <Text>{`Selected Printer Name: ${selectedPrinter.name}`}</Text>
            <Text>{`Selected Printer URI: ${selectedPrinter.url}`}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.buttonStyle} onPress={selectPrinter}>
          <Text>Click to Select Printer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={silentPrint}>
          <Text>Click for Silent Print</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        {Platform.OS === 'ios' && customOptions()}

        <TouchableOpacity style={styles.buttonStyle} onPress={printPDF}>
          <Text style={{color: textColor}}>Click to Print PDF</Text>
        </TouchableOpacity>
      </View>

      <WebView
        originWhitelist={['*']}
        javaScriptEnabled
        source={{html: HTMLView}}
      />
    </View>
  );
};
export default Invoice;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#ff9000',
    padding: 10,
    width: 300,
    marginVertical: 10,
  },
});
