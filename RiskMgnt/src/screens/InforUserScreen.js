import React, {Component} from 'react';
import {StyleSheet, Text, View, AsyncStorage} from 'react-native';
import * as Define from '../components/locales/Language.json';
import * as API from '../components/locales/Define.json';
import HeaderForm from '../containers/Header';
import FooterCamera from '../components/form/FooterCamera';
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Button,
  Item,
} from 'native-base';
import * as Language from '../components/locales/Language.json';
import RNFetchBlob from 'rn-fetch-blob';
export default class SearchScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor() {
    super();
    this.state = {
      DataShow: [],
      username: '',
      mailaddress: '',
      groupid: '',
      companyid: '',
      PlaceGroup: [],
      PlaceData: [],
    };
  }
  componentDidMount() {
    this.getUserData();
  }
  getUserData = async () => {
    try {
      let UserToken = await AsyncStorage.getItem('UserToken');
      const retrievedItem = await AsyncStorage.getItem('DataUser');
      const item = JSON.parse(retrievedItem);
      var uri = API.API_PATH + API.GET_GROUP_INFOR + item.companyid.toString();
      console.log('uri: ', uri);
      var Authorization = 'Bearer ' + UserToken;
      RNFetchBlob.fetch('GET', uri, {
        Authorization: Authorization,
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .then(resp => {
        var tempMSG = resp.data;
        var jsonObj = JSON.parse(tempMSG);
        console.log('jsonObj: ', jsonObj);
        jsonObj.forEach(function(itm){
          if(item.groupid === itm.groupid){
            this.state.groupid = itm.groupname;
          }
        })
      });
      this.setState({
        username: item.username,
        mailaddress: item.mailaddress,
        //groupid: item.groupid,
        companyid: item.companyid,
      });
      console.log('username:', this.state.username);
      console.log('mailaddress:', this.state.mailaddress);
      console.log('groupid:', this.state.groupid);
      console.log('companyid:', this.state.companyid);
    } catch (error) {
      console.log(error.message);
    }
  };
  render() {
    return (
      <Container>
        <HeaderForm
          actionOnPressLeft={() => this.props.navigation.openDrawer()}
          actionOnPressRight={() => this.props.navigation.navigate('User')}
        />
        <Content>
          <View style={styles.container}>
            <View style={styles.StyleView}>
              <Text style={styles.StyleText}> {Language.USERNAME} </Text>
              <Text style={styles.StyleText}>    {this.state.username}</Text>
            </View>
            <View style={styles.StyleView}>
              <Text style={styles.StyleText}> {Language.NAMEGROUP} </Text>
              <Text style={styles.StyleText}>    {this.state.groupid}</Text>
            </View>
            <View style={styles.StyleView}>
              <Text style={styles.StyleText}> {Language.NAMEENTERPRISE} </Text>
              <Text style={styles.StyleText}>    {this.state.companyid}</Text>
            </View>
            <View style={styles.StyleView}>
              <Text style={styles.StyleText}> {Language.MAILADRESS} </Text>
              <Text style={styles.StyleText}>    {this.state.mailaddress}</Text>
            </View>
          </View>
        </Content>
        <Footer style={styles.back}>
          <FooterCamera
            actionOnPressBackItem={() =>
              this.props.navigation.navigate('NewItem')
            }
            style={{flex:1}}
          />
        </Footer>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingLeft: 20,
    justifyContent: 'space-between',
  },
  back: {
    backgroundColor: '#F5FCFF',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  StyleView: {
    padding: 20,
  },
  StyleText: {
    fontSize: 20,
  },
});