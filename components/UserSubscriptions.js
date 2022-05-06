import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Divider} from 'react-native-elements';
import {checkSyncData, getSyncData} from './AsyncStorage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {postData} from './FetchApi';
import {ThemeContext} from './ThemeContext';
import {Button} from 'react-native-paper';
// Import HTML to PDF
import RNHTMLtoPDF from 'react-native-html-to-pdf';
// Import RNPrint
import RNPrint from 'react-native-print';

const {width, height} = Dimensions.get('window');

export const UserSubscriptions = ({navigation}) => {
  const {theme} = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  const [subs, setSubs] = useState([]);
  const [expired, setExpired] = useState(false);
  const [notSubText, setNotSubText] = useState('');
  const [loading,setLoading] = useState(false);

  const checkLogin = async () => {
    var key = await checkSyncData();

    if (key) {
      var userData = await getSyncData(key[0]).then(async res => {
        fetchSubscriptions(res);
      });
    }
  };

  const printInvoice =async (data) => {
    setLoading(true);
    const percentage = parseFloat(data.d_percentage);
  var discount = data.packageprice*(percentage/100);
  discount = discount.toFixed(2)
  var tax = (parseFloat(data.packageprice) - discount)*0.18;
  tax = tax.toFixed(2)
  var price = parseFloat(data.price).toFixed(2);

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
                  <p style='margin-bottom: 0rem;'>${data.email} ${data.telephone}</p>
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
                    parseInt(data.no_of_copies) > 1 && `<th class="text-right">Copies</th>`
                  }
                  <th class="text-right">Taxable Value</th>
                  ${
                    data.currency === 'INR' ?
                    `<th class="text-right">CGST</th>
                    <th class="text-right">SGST</th>`
                    :
                    `<th class="text-right">IGST</th>`
                  }
                  <th class="text-right">Amount (Rs)</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td class="unit" style='text-transform: capitalize;'>${data.user_type}</td>
                  
                  <td class="unit">${data.packagename}</td>	
                  <td class="unit">${data.currency === 'INR' ? 'Rs.' : '$'} ${data.packageprice}</td>
                  <td class="unit">${data.days} Days</td>
                  
                  <td class="unit">Rs ${discount}</td>
                  ${
                    parseInt(data.no_of_copies) > 1 && `<td class="unit">${data.no_of_copies}</td>`
                  }
                  <td class="unit">Rs ${tax}</td>
                  ${
                    data.currency === 'INR' ?
                    `<td class="unit">9 %</td>
                  <td class="qty">9 %</td>`:
                  `<td class="unit">18 %</td>`
                  }
                  <td class="total">${data.currency === 'INR' ? 'Rs.' : '$'} ${price}</td>
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
      <div style="display: flex;">
      <div class="notices" style='width: 85%;text-align: start;'>
          
          <div class="notice">Amount Chargeable (in Words): <b>${RsInWords}</b>
              <br>
              Declaration: We declare that this invoice shows the actual Price of the subscription described above that all particulars are true and correct. All disputes are subject to Madhya Pradesh, Jabalpur Jurisdiction only.
              <br>
              Subscriber Acknowledgement.
              <br>
              I, <b>${data.username}</b> confirm that the said services are being subscribed for my personal use and not for re-subscribe.
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


        const results = await RNHTMLtoPDF.convert({
          html: HTMLView,
          fileName: 'invoice',
          base64: true,
        });
        setLoading(false);
        await RNPrint.print({filePath: results.filePath});
  }



  const renderItem = ({item, index}) => {
    return (
      <View key={index}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            // width: width * 0.30,
            paddingVertical: 15,
            paddingLeft: 20,
          }}>
          <View style={{width: width * 0.85, justifyContent: 'flex-start'}}>
            <Text
              style={{
                fontSize: 17,
                color: textColor,
                fontWeight: '700',
                paddingVertical: 5,
              }}>
              {item.packagename}
            </Text>
            <Text style={{color: textColor}}>Days: {item.days}</Text>
            <Text style={{color: textColor}}>
              No. of Copies: {item.no_of_copies}
            </Text>
            <Text style={{color: textColor}}>
              Valid From : {item.valid_from}
            </Text>
            <Text style={{color: textColor}}>Valid To : {item.valid_to}</Text>
            <Text style={{color: textColor}}>Order Id: {item.oid}</Text>
          </View>
          <TouchableOpacity
            onPress={() => printInvoice(item)}>
            <View>
              <FontAwesome5 name="file-invoice" size={21} color={textColor} />
            </View>
          </TouchableOpacity>
        </View>
        <Divider />
      </View>
    );
  };

  const fetchSubscriptions = async res => {
    var body = {type: 1, user_id: res.id, user_type: res.usertype};
    var result = await postData('api/getSubscription', body);
    if (result.data === 'Not Subscribed yet') {
      setNotSubText('Not Subscribed yet');
    } else {
      setSubs(result?.data);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
      <ActivityIndicator
        animating={loading}
        size={'large'}
        style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerContent, {color: textColor}]}>
            Your Subscriptions
          </Text>
        </View>
        {notSubText === 'Not Subscribed yet' ? (
          <View>
            <Text style={{color: textColor, padding: 20}}>{notSubText}</Text>

            <View style={{justifyContent:'center'}}>
            <Button
              onPress={() => navigation.navigate('Subscriptions')}
              color={textColor}
              contentStyle={styles.button}
              dark
              labelStyle={{fontSize:16,letterSpacing:0}} 
              mode="contained"
              style={{backgroundColor: '#ff9000',marginHorizontal:20}}>
              Buy Subscription
            </Button>
            </View>
          </View>
        ) : (
          <FlatList
            data={subs}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={() => <ActivityIndicator size="large" />}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  headerContent: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  image: {
    height: height * 0.15,
    width: width * 0.24,
    marginRight: 20,
    resizeMode: 'stretch',
    borderRadius: 5,
    // elevation: 5,
    // shadowOpacity: 2,
    // shadowRadius: 14,
    // shadowColor: 'red',
    // shadowOffset: {width: 0, height: 0},
  },
  button: {
    width: width * 0.9,
    borderRadius: 10,
    paddingVertical: 10,
  },
});
