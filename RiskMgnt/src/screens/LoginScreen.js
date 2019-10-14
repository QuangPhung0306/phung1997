/* eslint-disable no-alert */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StatusBar,
  TextInput,
  AsyncStorage,
  Alert,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

import * as Define from '../components/locales/Define.json';
import * as Language from '../components/locales/Language.json';
export default class LoginScreen extends Component {
  state = {
    user: '',
    password: '',
    DataUser: null,
  };
  handleUserChange = user => {
    this.setState({user});
  };
  handlePasswordChange = password => {
    this.setState({password});
  };

  onLogin = async () => {
    const {user, password} = this.state;
    console.debug('onLogin --- start');
    console.log('this.state.DataUser 0: ', this.state.DataUser);
    if (user.length > 0 && password.length > 0) {
      console.log(' Fetch ');
      var uri = Define.API_PATH + Define.AUTH;
      RNFetchBlob.fetch(
        'POST',
        uri,
        {
          Authorization: 'Bearer',
          'Content-Type': 'multipart/form-data',
        },
        [{name: 'mailaddress', data: user}, {name: 'password', data: password}],
      )
        .then(resp => {
          var tempMSG = resp.data;
          console.log('tempMSG: ', tempMSG);
          var obj = JSON.parse(tempMSG);
          console.log('obj: ', obj);
          if (obj.data != null) {
            this.setState({
              DataUser: obj.data.user,
            });
            console.log('this.state.DataUser 1: ', this.state.DataUser);
            this.SaveUserToken();
          } else {
            Alert.alert(Language.ERR_WRONG_INPUT);
          }
        })
        .catch(err => {
          console.log(err);
          Alert.alert(Language.ERR_DISC);
        });
      console.log('this.state.DataUser 2: ', this.state.DataUser);
    } else {
      Alert.alert(Language.ERR_NOT_INPUT);
    }
  };

  async SaveUserToken() {
    if (this.state.DataUser != null) {
      try {
        await AsyncStorage.setItem(
          'DataUser',
          JSON.stringify(this.state.DataUser),
        );
        await AsyncStorage.setItem('UserToken', this.state.DataUser.user_token);
        this.props.navigation.navigate('App');
      } catch (error) {
        console.log('Error set UserToken: ', error.message);
      }
    }
  }

  render() {
    const {user, password} = this.state;
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        style={styles.container}>
        <View style={styles.StyleText}>
          <Text style={{fontSize: 20}}> {Language.TITLE_LOGIN} </Text>
          <Text style={{fontSize: 20}}> {Language.USEPASS_LOGIN} </Text>
          <Text style={{fontSize: 20}}> {Language.PLEASE_LOGIN}</Text>
        </View>
        <View style={styles.StyleLogin}>
          <View style={styles.USerPut}>
            <Text style={{flex: 1, fontSize: 20}}> {Language.USER_ID} </Text>
            <TextInput
              name="user"
              value={user}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              // placeholder="Email or Mobile Num"
              placeholderTextColor="rgba(225,225,225,0.7)"
              onChangeText={this.handleUserChange}
            />
          </View>
          <View style={styles.USerPut}>
            <Text style={{flex: 1, fontSize: 20}}> {Language.PASS} </Text>
            <TextInput
              name="password"
              value={password}
              style={styles.input}
              returnKeyType="go"
              // placeholder="Password"
              placeholderTextColor="rgba(225,225,225,0.7)"
              //  secureTextEntry
              onChangeText={this.handlePasswordChange}
            />
          </View>
          <View style={styles.StyleButton}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.onLogin}>
              <Text style={styles.buttonText}> {Language.CONFIRM} </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    margin: 40,
  },
  buttonContainer: {
    backgroundColor: '#fff',
    //paddingVertical: 10,
    //justifyContent: 'flex-end',
    //paddingLeft: 30,
    borderColor: '#0a0a0a',
    borderWidth: 1,
    height: 35,
    width: 110,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    //color: '#0a0a0a',
    textAlign: 'center',
    //fontWeight: '700',
    flex: 1,
    fontSize: 20,
    paddingTop: 5,
    //paddingBottom: 5,
  },
  input: {
    height: 40,
    //backgroundColor: 'rgba(225,225,225,0.2)',
    marginBottom: 20,
    padding: 5,
    color: '#0a0a0a',
    flex: 1,
    borderColor: '#1f1e1e',
    borderWidth: 1,
    width: 120,
    fontSize: 20,
  },
  USerPut: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  StyleText: {
    //flexDirection: 'column',
    //paddingTop: 30,
    //justifyContent: 'space-around',
    flex: 0.35,
    fontSize: 20,
  },
  StyleLogin: {
    flex: 0.65,
  },
  StyleButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 30,
  },
});
