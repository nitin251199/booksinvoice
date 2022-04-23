import React, {useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import {Button, Card} from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import TextTicker from 'react-native-text-ticker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { checkSyncData, getSyncData } from './AsyncStorage';
import {postData} from './FetchApi';
import { ThemeContext } from './ThemeContext';

const {width, height} = Dimensions.get('window');

export const Subscriptions = ({navigation}) => {
  const [dataIndiaInd, setDataIndiaInd] = React.useState([]);
  const [dataIndiaOrg, setDataIndiaOrg] = React.useState([]);
  const [dataInternationalOrg, setDataInternationalOrg] = React.useState([]);
  const [dataInternationalInd, setDataInternationalInd] = React.useState([]);
  const [show, setShow] = React.useState(false);
  const [status, setStatus] = React.useState(0);
  const [showModal, setShowModal] = React.useState(false);
  const [copies, setCopies] = React.useState(1);

  const [selected, setSelected] = React.useState({
    id: '',
    packagename: 'Select Any Package',
    currency: '',
    packageprice: '',
    packagepricedoller: '',
    packagedays: '',
    packagefor: '',
  });

  const { theme } = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';
  const modelBackgroundColor = theme === 'dark' ? '#191414' : '#999';

  const fetchAllSubscriptions = async () => {
    var body = {type: 1};
    var result = await postData('api/getPackges', body);
    setDataIndiaInd(result.india_ind);
    setDataIndiaOrg(result.india_org);
    setDataInternationalOrg(result.other_org);
    setDataInternationalInd(result.other_ind);
    setShow(true);
  };

  const checkSession = async () => {
    var key = await checkSyncData();
    if (key[0]) {
      var userData = await getSyncData(key[0]);
      if(userData.usertype == 'Individual'){
        setStatus(1)
      }
      if(userData.usertype == 'Organisation'){
        setStatus(2)
      }
    }
  }


  useEffect(function () {
    fetchAllSubscriptions();
    checkSession();
  }, []);

  const handleSelected = item => {
    var {
      id,
      packagename,
      currency,
      packageprice,
      packagepricedoller,
      packagedays,
      packagefor,
    } = item;
    setSelected({
      id,
      packagename,
      currency,
      packageprice,
      packagepricedoller,
      packagedays,
      packagefor,
    });
  };

  const handleBuy = async() => {
    var isLogin = await getSyncData('isLogin');
    if(isLogin){
      if(status === 2){
        setShowModal(true)
      }
      else {
        navigation.navigate('PaymentSummary', { selected, copies });
      } 
    }
    else{
      navigation.navigate('Login');
    }  
  }

  const handleProceed = async() => {
    var isLogin = await getSyncData('isLogin');
    if(isLogin){
      if(selected.packagename === 'Limited Special Offer*' || selected.packagename === 'Limited Period Offer'){
        if(copies < 100)
        {
         return ToastAndroid.show('Minimum 100 Copies Required', ToastAndroid.SHORT);
        }
      }
      else 
      {
        if(copies < 50)
        {
         return ToastAndroid.show('Minimum 50 Copies Required', ToastAndroid.SHORT);
        }
      }
      setShowModal(false)
    navigation.navigate('PaymentSummary', { selected, copies });
    }
    else{
      ToastAndroid.show('Please Login First', ToastAndroid.SHORT);
    }
  }

  const copiesModal = () => {
    return(
      <Modal
      animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={[
              {
                backgroundColor: modelBackgroundColor,
                padding: 20,
                borderRadius: 10,
              },
            ]}>
            <Text style={{fontSize:20, fontWeight:'bold',color: textColor,margin:10}}>
              {selected.packagename}
            </Text>
            <Text style={{fontSize:14, fontWeight:'400', color:textColor,margin:20}}>
              No. of Days {selected.packagedays}
            </Text>
            <TextInput
              value={copies}
              onChangeText={text => setCopies(text)}
              style={{borderWidth:1,borderColor: textColor, borderRadius: 10,paddingLeft:10, color: textColor}}
              placeholder="No. of copies"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={()=>handleProceed()}>
            <View style={{marginVertical:10,padding:15, borderRadius:10,backgroundColor:'#ff9000'}}>
              <Text style={{textAlign:'center',fontWeight:'800',color:'#FFF'}}>Proceed to pay</Text>
            </View>
            </TouchableOpacity>
          </View>
        </View>

      </Modal>
    )
  }

  const DisplayData = ({item}) => {
    return (
      <TouchableWithoutFeedback onPress={() => handleSelected(item)}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 15,
            borderColor:
              selected.id === item.id
                ? theme === 'dark'
                  ? 'red'
                  : '#000'
                : theme === 'dark'
                ? '#212121'
                : '#FFF',
            borderWidth: 1,
            borderRadius: 10,
          }}>
          <Text style={{width: width * 0.4, color: textColor}}>{item.packagename}</Text>
          <Text style={{color: textColor}}>
            {item.currency}{' '}
            {item.packageprice == ''
              ? item.packagepricedoller
              : item.packageprice}
          </Text>
          <Text style={{color: textColor}}>{item.packagedays}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
        },
      ]}>
      <View style={{alignItems:'center',}}>
        <ScrollView style={{width: width}} showsVerticalScrollIndicator={false}>
          <Card
            containerStyle={{
              elevation: 5,
              backgroundColor: '#e30047',
              borderRadius: 20,
              width: '90%',
            }}>
            <View style={{display: 'flex', padding: 15, alignItems: 'center'}}>
              <Image
                style={{width: 80, height: 80, borderRadius: 10}}
                source={require('../../images/logo.jpg')}
              />
            </View>
            <Card.Divider style={{backgroundColor: 'white'}} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '800',
                  color: '#FFF',
                  textAlign: 'center',
                  alignItems: 'center',
                }}>
                Go Premium
              </Text>
              <FontAwesome5
                style={{paddingHorizontal: 10}}
                name="crown"
                size={20}
                color="gold"
              />
            </View>
            <Text style={{textAlign: 'center', color: '#FFF'}}>
              Get the most of Booksinvoice
            </Text>
          </Card>
          {
            status === 0 ? 
            <>
            <Card
            containerStyle={{
              elevation: 5,
              backgroundColor: backgroundColor,
              borderRadius: 20,
              width: '90%',
            }}>
            <Card.Title
              style={{
                fontSize: 20,
                fontWeight: '800',
                color: textColor,
                textAlign: 'center',
              }}>
              For Indian Individuals
            </Card.Title>
            <Card.Divider style={{backgroundColor: 'white'}} />
            <View style={{flexDirection: 'column'}}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 15,
                }}>
                <Text
                  style={{
                    width: width * 0.4,
                    color: textColor,
                    fontWeight: '700',
                    fontSize: 16,
                  }}>
                  PACKAGE NAME
                </Text>
                <Text
                  style={{color: textColor, fontWeight: '700', fontSize: 16}}>
                  PRICE
                </Text>
                <Text
                  style={{color: textColor, fontWeight: '700', fontSize: 16}}>
                  DAYS
                </Text>
              </View>
              <SkeletonContent
                containerStyle={{flex: 1}}
                isLoading={!show}
                boneColor={backgroundColor}
                highlightColor="#333333"
                layout={[
                  {
                    key: '1',
                    width: width * 0.8,
                    height: 30,
                    marginBottom: 6,
                  },
                  {
                    key: '2',
                    width: width * 0.8,
                    height: 30,
                    marginBottom: 6,
                  },
                  {
                    key: '3',
                    width: width * 0.8,
                    height: 30,
                    marginBottom: 6,
                  },
                ]}>
                {dataIndiaInd.map((item, index) => {
                  return <DisplayData item={item} key={index} />;
                })}
              </SkeletonContent>
            </View>
          </Card>
          <Card
            containerStyle={{
              elevation: 5,
              backgroundColor: backgroundColor,
              borderRadius: 20,
              width: '90%',
            }}>
            <Card.Title
              style={{
                fontSize: 20,
                fontWeight: '800',
                color: textColor,
                textAlign: 'center',
              }}>
              For Indian Organisations
            </Card.Title>
            <Card.Divider style={{backgroundColor: 'white'}} />
            <View style={{flexDirection: 'column'}}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 15,
                }}>
                <Text
                  style={{
                    width: width * 0.4,
                    color: textColor,
                    fontWeight: '700',
                    fontSize: 16,
                  }}>
                  PACKAGE NAME
                </Text>
                <Text
                  style={{color: textColor, fontWeight: '700', fontSize: 16}}>
                  PRICE
                </Text>
                <Text
                  style={{color: textColor, fontWeight: '700', fontSize: 16}}>
                  DAYS
                </Text>
              </View>
              <SkeletonContent
                containerStyle={{flex: 1}}
                isLoading={!show}
                boneColor={backgroundColor}
                highlightColor="#333333"
                layout={[
                  {
                    key: '1',
                    width: width * 0.8,
                    height: 30,
                    marginBottom: 6,
                  },
                  {
                    key: '2',
                    width: width * 0.8,
                    height: 30,
                    marginBottom: 6,
                  },
                  {
                    key: '3',
                    width: width * 0.8,
                    height: 30,
                    marginBottom: 6,
                  },
                ]}>
              {
                dataIndiaOrg.map((item, index) => {
                  return <DisplayData item={item} key={index} />;
                })
              }
              </SkeletonContent>
            </View>
          </Card>
          <Card
            containerStyle={{
              elevation: 5,
              backgroundColor: backgroundColor,
              borderRadius: 20,
              width: '90%',
            }}>
            <Card.Title
              style={{
                fontSize: 20,
                fontWeight: '800',
                color: textColor,
                textAlign: 'center',
              }}>
              For Foreign Individuals
            </Card.Title>
            <Card.Divider style={{backgroundColor: 'white'}} />
            <View style={{flexDirection: 'column'}}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 15,
                }}>
                <Text
                  style={{
                    width: width * 0.4,
                    color: textColor,
                    fontWeight: '700',
                    fontSize: 16,
                  }}>
                  PACKAGE NAME
                </Text>
                <Text
                  style={{color: textColor, fontWeight: '700', fontSize: 16}}>
                  PRICE
                </Text>
                <Text
                  style={{color: textColor, fontWeight: '700', fontSize: 16}}>
                  DAYS
                </Text>
              </View>
              <SkeletonContent
                containerStyle={{flex: 1}}
                isLoading={!show}
                boneColor={backgroundColor}
                highlightColor="#333333"
                layout={[
                  {
                    key: '1',
                    width: width * 0.8,
                    height: 30,
                    marginBottom: 6,
                  },
                  {
                    key: '2',
                    width: width * 0.8,
                    height: 30,
                    marginBottom: 6,
                  },
                  {
                    key: '3',
                    width: width * 0.8,
                    height: 30,
                    marginBottom: 6,
                  },
                ]}>
              {
                dataInternationalInd.map((item, index) => {
                  return <DisplayData item={item} key={index} />;
                })
              }
              </SkeletonContent>
            </View>
          </Card>
          <Card
            containerStyle={{
              elevation: 5,
              backgroundColor: backgroundColor,
              borderRadius: 20,
              width: '90%',
            }}>
            <Card.Title
              style={{
                fontSize: 20,
                fontWeight: '800',
                color: textColor,
                textAlign: 'center',
              }}>
              For Foreign Organisations
            </Card.Title>
            <Card.Divider style={{backgroundColor: 'white'}} />
            <View style={{flexDirection: 'column'}}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 15,
                }}>
                <Text
                  style={{
                    width: width * 0.4,
                    color: textColor,
                    fontWeight: '700',
                    fontSize: 16,
                  }}>
                  PACKAGE NAME
                </Text>
                <Text
                  style={{color: textColor, fontWeight: '700', fontSize: 16}}>
                  PRICE
                </Text>
                <Text
                  style={{color: textColor, fontWeight: '700', fontSize: 16}}>
                  DAYS
                </Text>
              </View>
              <SkeletonContent
                containerStyle={{flex: 1}}
                isLoading={!show}
                boneColor={backgroundColor}
                highlightColor="#333333"
                layout={[
                  {
                    key: '1',
                    width: width * 0.8,
                    height: 30,
                    marginBottom: 6,
                  },
                  {
                    key: '2',
                    width: width * 0.8,
                    height: 30,
                    marginBottom: 6,
                  },
                  {
                    key: '3',
                    width: width * 0.8,
                    height: 30,
                    marginBottom: 6,
                  },
                ]}>
              {
                dataInternationalOrg.map((item, index) => {
                  return <DisplayData item={item} key={index} />;
                })
              }
              </SkeletonContent>
            </View>
          </Card>
          </>
          :
          status === 1 ? 
          <>
          <Card
            containerStyle={{
              elevation: 5,
              backgroundColor: backgroundColor,
              borderRadius: 20,
              width: '90%',
            }}>
            <Card.Title
              style={{
                fontSize: 20,
                fontWeight: '800',
                color: textColor,
                textAlign: 'center',
              }}>
              For Indian Individuals
            </Card.Title>
            <Card.Divider style={{backgroundColor: 'white'}} />
            <View style={{flexDirection: 'column'}}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 15,
                }}>
                <Text
                  style={{
                    width: width * 0.4,
                    color: textColor,
                    fontWeight: '700',
                    fontSize: 16,
                  }}>
                  PACKAGE NAME
                </Text>
                <Text
                  style={{color: textColor, fontWeight: '700', fontSize: 16}}>
                  PRICE
                </Text>
                <Text
                  style={{color: textColor, fontWeight: '700', fontSize: 16}}>
                  DAYS
                </Text>
              </View>
              <SkeletonContent
                containerStyle={{flex: 1}}
                isLoading={!show}
                boneColor={backgroundColor}
                highlightColor="#333333"
                layout={[
                  {
                    key: '1',
                    width: width * 0.8,
                    height: 30,
                    marginBottom: 6,
                  },
                  {
                    key: '2',
                    width: width * 0.8,
                    height: 30,
                    marginBottom: 6,
                  },
                  {
                    key: '3',
                    width: width * 0.8,
                    height: 30,
                    marginBottom: 6,
                  },
                ]}>
                {dataIndiaInd.map((item, index) => {
                  return <DisplayData item={item} key={index} />;
                })}
              </SkeletonContent>
            </View>
          </Card>
          <Card
            containerStyle={{
              elevation: 5,
              backgroundColor: backgroundColor,
              borderRadius: 20,
              width: '90%',
            }}>
            <Card.Title
              style={{
                fontSize: 20,
                fontWeight: '800',
                color: textColor,
                textAlign: 'center',
              }}>
              For Foreign Individuals
            </Card.Title>
            <Card.Divider style={{backgroundColor: 'white'}} />
            <View style={{flexDirection: 'column'}}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 15,
                }}>
                <Text
                  style={{
                    width: width * 0.4,
                    color: textColor,
                    fontWeight: '700',
                    fontSize: 16,
                  }}>
                  PACKAGE NAME
                </Text>
                <Text
                  style={{color: textColor, fontWeight: '700', fontSize: 16}}>
                  PRICE
                </Text>
                <Text
                  style={{color: textColor, fontWeight: '700', fontSize: 16}}>
                  DAYS
                </Text>
              </View>
              <SkeletonContent
                containerStyle={{flex: 1}}
                isLoading={!show}
                boneColor={backgroundColor}
                highlightColor="#333333"
                layout={[
                  {
                    key: '1',
                    width: width * 0.8,
                    height: 30,
                    marginBottom: 6,
                  },
                  {
                    key: '2',
                    width: width * 0.8,
                    height: 30,
                    marginBottom: 6,
                  },
                  {
                    key: '3',
                    width: width * 0.8,
                    height: 30,
                    marginBottom: 6,
                  },
                ]}>
              {
                dataInternationalInd.map((item, index) => {
                  return <DisplayData item={item} key={index} />;
                })
              }
              </SkeletonContent>
            </View>
          </Card>
          </>
          : 
          <>
        <Card
          containerStyle={{
            elevation: 5,
            backgroundColor: backgroundColor,
            borderRadius: 20,
            width: '90%',
          }}>
          <Card.Title
            style={{
              fontSize: 20,
              fontWeight: '800',
              color: textColor,
              textAlign: 'center',
            }}>
            For Indian Organisations
          </Card.Title>
          <Card.Divider style={{backgroundColor: 'white'}} />
          <View style={{flexDirection: 'column'}}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 15,
              }}>
              <Text
                style={{
                  width: width * 0.4,
                  color: textColor,
                  fontWeight: '700',
                  fontSize: 16,
                }}>
                PACKAGE NAME
              </Text>
              <Text
                style={{color: textColor, fontWeight: '700', fontSize: 16}}>
                PRICE
              </Text>
              <Text
                style={{color: textColor, fontWeight: '700', fontSize: 16}}>
                DAYS
              </Text>
            </View>
            <SkeletonContent
              containerStyle={{flex: 1}}
              isLoading={!show}
              boneColor={backgroundColor}
              highlightColor="#333333"
              layout={[
                {
                  key: '1',
                  width: width * 0.8,
                  height: 30,
                  marginBottom: 6,
                },
                {
                  key: '2',
                  width: width * 0.8,
                  height: 30,
                  marginBottom: 6,
                },
                {
                  key: '3',
                  width: width * 0.8,
                  height: 30,
                  marginBottom: 6,
                },
              ]}>
            {
              dataIndiaOrg.map((item, index) => {
                return <DisplayData item={item} key={index} />;
              })
            }
            </SkeletonContent>
          </View>
        </Card>
        <Card
          containerStyle={{
            elevation: 5,
            backgroundColor: backgroundColor,
            borderRadius: 20,
            width: '90%',
          }}>
          <Card.Title
            style={{
              fontSize: 20,
              fontWeight: '800',
              color: textColor,
              textAlign: 'center',
            }}>
            For Foreign Organisations
          </Card.Title>
          <Card.Divider style={{backgroundColor: 'white'}} />
          <View style={{flexDirection: 'column'}}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 15,
              }}>
              <Text
                style={{
                  width: width * 0.4,
                  color: textColor,
                  fontWeight: '700',
                  fontSize: 16,
                }}>
                PACKAGE NAME
              </Text>
              <Text
                style={{color: textColor, fontWeight: '700', fontSize: 16}}>
                PRICE
              </Text>
              <Text
                style={{color: textColor, fontWeight: '700', fontSize: 16}}>
                DAYS
              </Text>
            </View>
            <SkeletonContent
              containerStyle={{flex: 1}}
              isLoading={!show}
              boneColor={backgroundColor}
              highlightColor="#333333"
              layout={[
                {
                  key: '1',
                  width: width * 0.8,
                  height: 30,
                  marginBottom: 6,
                },
                {
                  key: '2',
                  width: width * 0.8,
                  height: 30,
                  marginBottom: 6,
                },
                {
                  key: '3',
                  width: width * 0.8,
                  height: 30,
                  marginBottom: 6,
                },
              ]}>
            {
              dataInternationalOrg.map((item, index) => {
                return <DisplayData item={item} key={index} />;
              })
            }
            </SkeletonContent>
          </View>
        </Card>
        </>
          }
        </ScrollView>
        <View
          style={{
            backgroundColor: '#ff9000',
            width:width,
            height: height * 0.08,
            padding: 10,
            flexDirection: 'row',
            alignItems:'center'
          }}>
          <View style={{width: width * 0.62}}>
            <TextTicker
              style={{
                fontSize: 18,
                fontWeight: '800',
                color: 'black',
              }}
              duration={8000}
              loop
              bounce
              repeatSpacer={50}
              marqueeDelay={1000}
              useNativeDriver>
              {selected.packagename}
            </TextTicker>
          </View>
          <View>
            <Button
              disabled={selected.id !== '' ? false : true}
              onPress={()=>handleBuy()}
              title="Buy Now"
              titleStyle={{fontWeight: 'bold', fontSize: 14}}
              buttonStyle={{
                borderWidth: 0,
                borderColor: 'transparent',
                borderRadius: 20,
              }}
              containerStyle={{
                width: 110,
                marginHorizontal: 13,
                marginVertical: 0,
              }}
              
            />
          </View>
        </View>
      </View>
      {copiesModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
