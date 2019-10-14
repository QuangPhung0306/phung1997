import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  AsyncStorage,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Picker,
  TextInput,
  TouchableHighlight,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Button,
} from 'native-base';
import RNFetchBlob from 'rn-fetch-blob';
import DatePicker from 'react-native-datepicker';
import * as Language from '../components/locales/Language.json';
import * as Define from '../components/locales/Define.json';
import * as API from '../components/locales/Define.json';
import HeaderForm from '../containers/Header';
import FooterHomeForm from '../components/form/FooterHomeForm';
import ShowItemHomeForm from '../components/form/ShowItemHomeForm';
import Modal from 'react-native-modal';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    backgroundColor: '#2980b6',
    paddingVertical: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  footer: {
    alignSelf: 'flex-end',
  },
  container1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  StyleView: {
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
    height: 70,
    justifyContent: 'center',
    padding: 5,
  },
  StyleText1: {
    //justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 20,
    padding: 10,
  },
  StyleDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  StyleModal: {
    flex: 0.65,
    backgroundColor: '#ffffff',
  },
  StyleButton: {
    width: 30,
    height: 30,
  },
  StyleExit: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  StyleSave: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 5,
    paddingTop: 5,
    paddingLeft: 5,
  },
  ButtonSave: {
    width: 50,
    height: 30,
    backgroundColor: '#575859',
    justifyContent: 'center',
    alignItems: 'center',
  },
  //scrollView: {
  //  paddingLeft: 10,
  //  paddingRight: 30,
  //},
  StylePicker: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    height: 40,
    width: '100%',
  },
});

export default class HomeScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: (
        <HeaderForm
          actionOnPressRight={() => navigation.navigate('User')}
          actionOnPressLeft={() => navigation.openDrawer()}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      DataShow: [],
      isDataLoaded: false,
      DataUser: null,
      isModalVisible: false,
      DateStart: '',
      DateEnd: '',
      ImFormation: '',
      PlaceNameSelected: '',
      KindNameSelected: '',
      KindPicker: [],
      PlacePicker: [],
      KindData: [],
      PlaceData: [],
    };
  }

  onSave = async () => {
    //const {DateStart, DateEnd, PlaceNameSelected, KindNameSelected, PlaceData} = this.state;

    if (this.state.DateStart > this.state.DateEnd) {
      Alert.alert('false');
      return;
    }

    var placeSearch = null;
    var kindSearch = null;
    var StartDate = "daystart" + this.state.DateStart.toString() + '&';
    var DayEnd = "dayend" + this.state.DateEnd.toString() + '&';
    var Tag = "tag" + this.state.xxxxxx + '&';

    var IDPlace = null;
    var IDKind = null;

    var placeList = this.state.PlacePicker;
    var PlaceIndex = this.state.PlaceNameSelected;

    var kindList = this.state.KindPicker;
    var kindIndex = this.state.KindNameSelected;

    this.state.PlaceData.forEach(function(item) {
      if(placeList[PlaceIndex] === item.placename){
        IDPlace = item.placeid;
      }
    });

    this.state.KindData.forEach(function(item){
      if(kindList[kindIndex] === item.kindName){
        IDKind = item.kindid;
      }
    });

    if (IDKind === null) {
      kindSearch = '';
    } else {
      kindSearch = "kindid=" + IDKind.toString() + '&';
    }

    if (IDPlace === null) {
      placeSearch = '';
    } else {
      placeSearch = "placeid=" + IDPlace.toString() + '&';
    }

    var uri = Define.API_PATH + Define.GET_INCATE + kindSearch + placeSearch ;//+ StartDate + DayEnd + Tag;
    console.log('uri: ', uri);
    let UserToken = await AsyncStorage.getItem('UserToken');
    var Authorization = 'Bearer ' + UserToken;
    console.log('Authorization', Authorization);
    RNFetchBlob.fetch('GET', uri, {
      Authorization: Authorization,
      'Content-Type': 'application/x-www-form-urlencoded',
    })
      .then(resp => {
        var tempMSG = resp.data;
        var jsonObj = JSON.parse(tempMSG);
        console.log('jsonObj:', jsonObj);
        this.setState({
          DataShow: jsonObj,
          isModalVisible: false,
        });
        console.log('this.state.PlacePicker:', this.state.PlacePicker);
        console.log('this.state.KindPicker:', this.state.KindPicker);
        console.log('this.state.PlaceData:', this.state.PlaceData);
        console.log('this.state.KindData:', this.state.KindData);
      })
      .catch(err => {
        console.log('err: ', err);
      });
  };

  componentDidMount() {
    this.getLocalDataUser();
    this.getAllData();
    this.getPickerData();
  }

  getLocalDataUser = async () => {
    try {
      const retrievedItem = await AsyncStorage.getItem('DataUser');
      const item = JSON.parse(retrievedItem);
      this.setState({
        DataUser: item,
      });
      console.log('DataUser:', this.state.DataUser);
    } catch (error) {
      console.log(error.message);
    }
  };

  getPickerData = async () => {
    let UserToken = await AsyncStorage.getItem('UserToken');
    const retrievedItem = await AsyncStorage.getItem('DataUser');
    const item = JSON.parse(retrievedItem);
    console.log('item: ', item);
    var uri = API.API_PATH + API.GET_PICKER_DATA + item.companyid.toString();
    console.log('uri: ', uri);
    var Authorization = 'Bearer ' + UserToken;
    RNFetchBlob.fetch('GET', uri, {
      Authorization: Authorization,
      'Content-Type': 'application/x-www-form-urlencoded',
    })
      .then(resp => {
        var tempMSG = resp.data;
        var jsonObj = JSON.parse(tempMSG);
        var DataPicker = jsonObj.data;

        console.log('DataShow:', DataPicker);
        var listKind = DataPicker.kind;
        console.log('listKind:', listKind);
        var listPlace = DataPicker.places;
        console.log('listPlace:', listPlace);

        var PlacePicker = this.state.PlacePicker;
        var KindPicker = this.state.KindPicker;
        PlacePicker.push('');
        KindPicker.push('');
        listPlace.forEach(function(itm) {
          var itmx = itm.placename;
          PlacePicker.push(itmx);
        });
        listKind.forEach(function(itm) {
          var itmx = itm.kindname;
          KindPicker.push(itmx);
        });

        console.log('PlacePicker:', PlacePicker);
        console.log('KindPicker:', KindPicker);

        this.setState({
          PlacePicker: PlacePicker,
          KindPicker: KindPicker,
          PlaceData: listPlace,
          KindData: listKind,
        });

        console.log('this.state.PlacePicker:', this.state.PlacePicker);
        console.log('this.state.KindPicker:', this.state.KindPicker);
        console.log('this.state.PlaceData:', this.state.PlaceData);
        console.log('this.state.KindData:', this.state.KindData);
      })
      .catch(err => {
        console.log('err: ', err);
      });
  };
  UpdatePlaceNameSelected = PlaceNameSelected => {
    this.setState({PlaceNameSelected: PlaceNameSelected});
  };

  UpdateKindNameSelected = KindNameSelected => {
    this.setState({KindNameSelected: KindNameSelected});
    console.log('KindNameSelected:', this.state.KindNameSelected);
  };

  getAllData = async () => {
    console.log('On_getAllData --- start');
    console.log(' Fetch... ');

    let UserToken = await AsyncStorage.getItem('UserToken');
    const retrievedItem = await AsyncStorage.getItem('DataUser');
    const item = JSON.parse(retrievedItem);
    console.log('item: ', item);
    var uri = Define.API_PATH + Define.GET_ALL_DATA + item.companyid.toString();
    var Authorization = 'Bearer ' + UserToken;
    RNFetchBlob.fetch('GET', uri, {
      Authorization: Authorization,
      'Content-Type': 'application/x-www-form-urlencoded',
    })
      .then(resp => {
        var tempMSG = resp.data;
        var jsonObj = JSON.parse(tempMSG);
        var DataShow = jsonObj.indicatedmatter;
        console.log('DataShow:', DataShow);
        var listLike = jsonObj.like;
        console.log('listLike:', listLike);
        DataShow.forEach(function(itm) {
          if (listLike.includes(itm.dataid)) {
            itm.liked = true;
          } else {
            itm.liked = false;
          }
        });
        this.setState({
          isDataLoaded: true,
          DataShow: DataShow,
        });
      })
      .catch(err => {
        console.log('err: ', err);
      });
  };

  onPressLike = async item => {
    console.log('onPressLike --- start');
    console.log(' Fetch... ');
    var uri = Define.API_PATH + Define.PRESS_LIKE;
    let UserToken = await AsyncStorage.getItem('UserToken');
    var Authorization = 'Bearer ' + UserToken;
    console.log('uri:', uri);
    console.log('entryuserid:', item.entryuserid);
    RNFetchBlob.fetch(
      'POST',
      uri,
      {
        Authorization: Authorization,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      [
        {name: 'entryuserid', data: item.entryuserid.toString()},
        {name: 'companyid', data: item.companyid.toString()},
        {name: 'dataid', data: item.dataid.toString()},
      ],
    )
      .then(resp => {
        var tempMSG = resp.data;
        console.log('tempMSG like:', tempMSG);
        var jsonObj = JSON.parse(tempMSG);
        console.log('jsonObj like:', jsonObj);

        this.setStateLike(item, jsonObj);
      })
      .catch(err => {
        console.log('err like: ', err);
      });
  };

  setStateLike = (item, jsonObj) => {
    item.countlike = jsonObj.data;
    item.liked = !item.liked;
    const index = this.state.DataShow.findIndex(
      items => item.dataid === items.dataid,
    );

    console.log('index DataShow: ', index);
    this.state.DataShow[index] = item;
    this.setState({
      DataShow: this.state.DataShow,
    });

    console.log('DataShow after Like: ', this.state.DataShow);
  };

  renderItem = ({item}) => {
    var dt_array = item.entrydate.split(' ');
    var isStarOn = false;
    if (this.state.DataUser.userid === item.entryuserid) {
      isStarOn = true;
    }
    return (
      <ShowItemHomeForm
        DateTime={dt_array[0]}
        Note={item.comments}
        Risk={item.kindid}
        isStarOn={isStarOn}
        CountLike={item.countlike}
        ImageUri={item.image1}
        isLiked={item.liked}
        onPressLike={() => this.onPressLike(item)}
      />
    );
  };

  setModalVisible() {
    this.setState({isModalVisible: !this.state.isModalVisible});
  }

  render() {
    if (!this.state.isDataLoaded) {
      return (
        <View style={styles.container1}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <Container>
        <View style={{flex: 1, marginLeft: 10, marginRight: 10}}>
          <View style={styles.StyleText1}>
            <Text style={{fontSize:20}}>{Language.HOME_DAY}</Text>
            <View style={styles.StyleView}>
              <Text style={{justifyContent: 'flex-start'}}>
                {' '}
                {this.state.ImFormation}{' '}
              </Text>
            </View>
          </View>
          <View style={styles.StyleText1}>
            <Text style={{fontSize:20}}>{Language.HOME_ICON}</Text>
          </View>
          <FlatList
            data={this.state.DataShow}
            renderItem={this.renderItem}
            extraData={this.state}
          />
        </View>
        <Modal
          avoidKeyboard={false}
          animationType="slide"
          //transparent={false}
          isVisible={this.state.isModalVisible}>
          <View style={styles.StyleModal}>
            <View style={styles.StyleSave}>
              <TouchableHighlight
                style={styles.StyleExit}
                onPress={() => {
                  this.setModalVisible(!this.state.isModalVisible);
                }}
                underlayColor={'white'}>
                <Image
                  source={require('../images/cancel_web.png')}
                  style={styles.StyleButton}
                />
              </TouchableHighlight>
              <TouchableOpacity style={styles.ButtonSave} onPress={this.onSave}>
                <Text style={{color: 'white'}}> {Language.SAVE}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={{padding: 3, paddingLeft: 10, paddingRight: 30}}>
                <Text>{Language.LOCATION}</Text>
                <View style={{borderColor: 'gray', borderWidth: 1}}>
                  <Picker
                    style={{height: 40}}
                    mode="dropdown"
                    selectedValue={this.state.PlaceNameSelected}
                    onValueChange={this.UpdatePlaceNameSelected}>
                    {this.state.PlacePicker.map((item, index) => {
                      return (
                        <Picker.Item label={item} value={index} key={index} />
                      );
                    })}
                  </Picker>
                </View>
              </View>
              <View style={{padding: 3, paddingLeft: 10, paddingRight: 30}}>
                <Text>{Language.RISK}</Text>
                <View style={{borderColor: 'gray', borderWidth: 1}}>
                  <Picker
                    style={{height: 40}}
                    mode="dropdown"
                    selectedValue={this.state.KindNameSelected}
                    onValueChange={this.UpdateKindNameSelected}>
                    {this.state.KindPicker.map((item, index) => {
                      return (
                        <Picker.Item label={item} value={index} key={index} />
                      );
                    })}
                  </Picker>
                </View>
              </View>
              <View style={{padding: 3, paddingLeft: 10, paddingRight: 30}}>
                <Text>{Language.TAG}</Text>
                <TextInput
                  style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                />
              </View>
              <Text style={{padding: 3, paddingLeft: 10, paddingRight: 30}}>
                {' '}
                {Language.CALENDAR}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  paddingLeft: 10,
                  paddingRight: 20,
                  padding: 5,
                }}>
                <Text> {Language.START}</Text>
                <DatePicker
                  style={styles.StylePicker}
                  date={this.state.DateStart}
                  mode="date"
                  format="YYYY-MM-DD"
                  //confirmBtnText="Confirm"
                  //cancelBtnText="Cancel"
                  customStyles={{
                    dateInput: {
                      marginLeft: 10,
                    },
                  }}
                  onDateChange={date => {
                    this.setState({DateStart: date});
                  }}
                  showIcon={false}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingLeft: 10,
                  paddingRight: 20,
                  padding: 5,
                }}>
                <View>
                  <Text> {Language.END} </Text>
                </View>
                <DatePicker
                  style={styles.StylePicker}
                  date={this.state.DateEnd}
                  format="YYYY-MM-DD"
                  //confirmBtnText="Confirm"
                  //cancelBtnText="Cancel"
                  customStyles={{
                    dateInput: {
                      marginLeft: 10,
                    },
                  }}
                  onDateChange={date => {
                    this.setState({DateEnd: date});
                  }}
                  showIcon={false}
                />
              </View>
            </ScrollView>
          </View>
        </Modal>
        <Footer>
          <FooterHomeForm
            actionOnPressHome={() => this.props.navigation.navigate('Home')}
            actionOnPressAdditems={() =>
              this.props.navigation.navigate('NewItem')
            }
            actionOnPressMap={() => this.props.navigation.navigate('Map')}
            actionOnPressSearch={() => this.setModalVisible()}
            isHomeScreen={true}
          />
        </Footer>
      </Container>
    );
  }
}
