import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Picker,
  TextInput,
  AsyncStorage,
} from 'react-native';

import RNFetchBlob from 'rn-fetch-blob';
import PhotoGrid from 'react-native-image-grid';

import dotVertical from '../images/dotVertical.png';
import Check from '../images/tick-circle.png';
import unCheck from '../images/circle.png';

import Icon from 'react-native-vector-icons/FontAwesome';
import {Container, Content, Footer} from 'native-base';

import * as Define from '../components/locales/Language.json';
import * as API from '../components/locales/Define.json';

import HeaderForm from '../containers/Header';
import FooterNewItem from '../components/form/FooterNewItem';

export default class NewItemScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: (
        <HeaderForm
          title={Define.NEW_ITEM}
          actionOnPressRight={() => navigation.navigate('User')}
          actionOnPressLeft={() => navigation.openDrawer()}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      imagesSelected: [
        {
          DateTime: '2008/08/09 14:05:01',
          uri:
            'https://www.maxpixel.net/static/photo/1x/Site-Build-Construction-Crane-Project-Architecture-4527357.jpg',
        },
        {
          DateTime: '2008/08/09 14:08:21',
          uri:
            'https://www.maxpixel.net/static/photo/1x/Us-Crane-Usa-Skyscraper-Cranes-Construction-4433574.jpg',
        },
        {
          DateTime: '2008/08/09 15:12:12',
          uri:
            'https://www.maxpixel.net/static/photo/1x/Construction-Build-Construction-Work-Site-1510561.jpg',
        },
      ],
      isVisible: false,
      uriShow: '',
      isShowPicker: false,
      KindPicker: [],
      PlacePicker: [],
      PlaceNameSelected: '',
      KindNameSelected: '',
    };
  }

  componentWillMount = async () => {
    this.state.imagesSelected.forEach(function(itm) {
      itm.isSelected = false;
    });
    this.setState({
      imagesSelected: this.state.imagesSelected,
    });

    this.getPickerData();
  };

  getPickerData = async () => {
    let UserToken = await AsyncStorage.getItem('UserToken');
    const retrievedItem = await AsyncStorage.getItem('DataUser');
    const item = JSON.parse(retrievedItem);
    //console.log('item: ', item);
    var uri = API.API_PATH + API.GET_PICKER_DATA + item.companyid.toString();
    //console.log('uri: ', uri);
    var Authorization = 'Bearer ' + UserToken;
    RNFetchBlob.fetch('GET', uri, {
      Authorization: Authorization,
      'Content-Type': 'application/x-www-form-urlencoded',
    })
      .then(resp => {
        var tempMSG = resp.data;
        var jsonObj = JSON.parse(tempMSG);
        var DataPicker = jsonObj.data;
        //console.log('DataShow:', DataPicker);
        var listKind = DataPicker.kind;
        //console.log('listKind:', listKind);
        var listPlace = DataPicker.places;
        //console.log('listPlace:', listPlace);

        var PlacePicker = this.state.PlacePicker;
        var KindPicker = this.state.KindPicker;

        listPlace.forEach(function(itm) {
          var itmx = itm.placename;
          PlacePicker.push(itmx);
        });

        listKind.forEach(function(itm) {
          var itmx = itm.kindname;
          KindPicker.push(itmx);
        });

        //console.log('PlacePicker:', PlacePicker);
        //console.log('KindPicker:', KindPicker);

        this.setState({
          PlacePicker: PlacePicker,
          KindPicker: KindPicker,
        });
      })
      .catch(err => {
        //console.log('err: ', err);
      });
  };

  UpdatePlaceNameSelected = PlaceNameSelected => {
    this.setState({PlaceNameSelected: PlaceNameSelected});
  };

  UpdateKindNameSelected = KindNameSelected => {
    this.setState({KindNameSelected: KindNameSelected});
  };

  OpenLongClickOption() {
    //console.log('OpenLongClickOption');
    this.setState({isShowPicker: !this.state.isShowPicker});
  }

  OpenOption() {
    Alert.alert(
      null,
      null,
      [
        {
          text: Define.CANCEL,
          //onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: Define.DELETE_IMAGE,
          onPress: () => {
            this.props.deleteImage;
          },
        },
        {
          text: Define.EDIT_IMAGE,
          onPress: () => {
            this.props.editImage;
          },
        },
      ],
      {cancelable: false},
    );
  }

  actionOnPickImage = item => {
    item.isSelected = !item.isSelected;
    const index = this.state.imagesSelected.findIndex(
      items => item.uri === items.uri,
    );

    this.state.imagesSelected[index] = item;
    this.setState({
      imagesSelected: this.state.imagesSelected,
    });
  };

  actionCancelPickImage() {
    this.state.imagesSelected.forEach(function(itm) {
      itm.isSelected = false;
    });
    this.setState({
      imagesSelected: this.state.imagesSelected,
      isShowPicker: false,
    });
  }

  renderItem = (item, itemSize, itemPaddingHorizontal) => {
    return (
      <View style={{borderColor: 'gray', borderWidth: 1}}>
        <TouchableOpacity
          style={{
            width: itemSize - 15,
            height: itemSize / 2,
            paddingHorizontal: itemPaddingHorizontal + 1,
            justifyContent: 'flex-end',
          }}
          onPress={() => {
            this.setState({isVisible: true, uriShow: item.uri});
          }}
          onLongPress={() => {
            this.setState({isShowPicker: true});
          }}>
          {this.state.isShowPicker ? (
            <TouchableOpacity onPress={() => this.actionOnPickImage(item)}>
              {item.isSelected ? (
                <Image source={Check} style={styles.StyleCheck} />
              ) : (
                <Image source={unCheck} style={styles.StyleCheck} />
              )}
            </TouchableOpacity>
          ) : null}
          <Image
            style={{flex: 1}}
            resizeMode="contain"
            source={{uri: item.uri}}
          />
        </TouchableOpacity>
        <View style={styles.option}>
          <Text style={{padding: 2}}>{item.DateTime}</Text>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => this.OpenOption()}>
            <Image source={dotVertical} style={{width: 20, height: 20}} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const User_Item_id = this.props.navigation.getParam('User_Item_id');
    return (
      <Container>
        <Content>
          <View style={styles.ContainImageBox}>
            <View style={styles.headerNewItems}>
              <Text>{Define.SHOW_IMAGE}</Text>
              <TouchableOpacity
                style={{backgroundColor: '#808080'}}
                onPress={this.onPressRegister}>
                <Text style={{color: '#fff', padding: 5}}>
                  {Define.ADD_NEW}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{padding: 3}}>
              <PhotoGrid
                data={this.state.imagesSelected}
                itemsPerRow={2}
                itemMargin={1}
                itemPaddingHorizontal={1}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index}
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              padding: 5,
              alignItems: 'stretch',
            }}>
            <View style={{padding: 3}}>
              <Text>{Define.LOCATION}</Text>
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
            <View style={{padding: 3}}>
              <Text>{Define.COMMENT}</Text>
              <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              />
            </View>
            <View style={{padding: 3}}>
              <Text>{Define.RISK}</Text>
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
            <View style={{padding: 3}}>
              <Text>{Define.TAG}</Text>
              <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              />
            </View>
            <View style={{padding: 3}}>
              <Text>{Define.PEOPLE}</Text>
              <TouchableOpacity
                style={{
                  height: 40,
                  borderColor: 'gray',
                  borderWidth: 1,
                  justifyContent: 'center',
                }}
                onPress={() => this.props.navigation.navigate('ChooseUser')}>
                <Text>{User_Item_id}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Modal
            visible={this.state.isVisible}
            animationType="slide"
            transparent={false}>
            <View style={styles.fullscreenImage}>
              <Image
                resizeMode="contain"
                source={{uri: this.state.uriShow}}
                style={{flex: 1}}
              />
              <TouchableOpacity
                style={styles.overlayCancel}
                onPress={() => {
                  this.setState({isVisible: false});
                }}>
                <Icon name="close" style={styles.cancelIcon} size={28} />
              </TouchableOpacity>
            </View>
          </Modal>
        </Content>
        <Footer>
          <FooterNewItem
            actionOnPressHome={() => this.props.navigation.navigate('Home')}
            actionOnPressCamera={() => this.props.navigation.navigate('Camera')}
            actionOnPressMap={() => this.props.navigation.navigate('Map')}
            actionOnPressPickImage={() =>
              this.props.navigation.navigate('PickImage')
            }
            isNewItem={true}
            isLongPressImage={this.state.isShowPicker}
            actionOnPressBack={() => this.actionCancelPickImage()}
          />
        </Footer>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: 250,
    width: 250,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    backgroundColor: '#fcfcfc',
  },
  containerImage: {
    flex: 1,
    // remove width and height to override fixed static size
    width: null,
    height: null,
  },
  overlayCancel: {
    padding: 20,
    position: 'absolute',
    right: 10,
    top: 0,
  },
  cancelIcon: {
    color: 'white',
  },
  fullscreenImage: {
    flex: 1,
    backgroundColor: '#000',
  },
  ContainImageBox: {
    padding: 10,
    paddingTop: 1,
    flex: 1,
  },
  StyleCheck: {height: 25, width: 25},
  headerNewItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
  },
});
