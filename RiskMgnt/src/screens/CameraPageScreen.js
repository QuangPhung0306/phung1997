import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import {RNCamera} from 'react-native-camera';
import {Container, Content, Footer, Form} from 'native-base';
import FooterCamera from '../components/form/FooterCamera';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';
import {RNPhotoEditor} from 'react-native-photo-editor';
import Toolbar from '../components/form/toolbar.component';
import HeaderForm from '../containers/Header';
import * as Language from '../components/locales/Language.json';
export default class CameraPage extends Component {
  rncamera = null;

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

  state = {
    captures: [],
    capturing: null,
    cameraType: RNCamera.Constants.Type.back,
    flashMode: RNCamera.Constants.FlashMode.off,
  };

  setFlashMode = flashMode => this.setState({flashMode});
  setCameraType = cameraType => this.setState({cameraType});
  handleCaptureIn = () => this.setState({capturing: true});

  handleCaptureOut = () => {
    if (this.state.capturing) {
      this.camera.stopRecording();
    }
  };

  handleShortCapture = async () => {
    if (Platform.OS === 'android') {
      await checkAndroidPermission();
    }
    const options = {quality: 0.5, based64: true};
    const photoData = await this.camera.takePictureAsync(options).then(data => {
      console.log('dataPicture: ', data);
      console.log('dataPicture Uri: ', data.uri);
      var path = data.uri.slice(7);
      console.log('path: ', path);
      RNPhotoEditor.Edit({
        path: path,
        hiddenControls: ['crop', 'share', 'sticker'],
        onDone: () => {
          console.log('on done');
        },
        onCancel: () => {
          console.log('on cancel');
        },
      });
    });

    this.setState({
      capturing: false,
      captures: [photoData, ...this.state.captures],
    });
  };

  handleLongCapture = async () => {
    const videoData = await this.camera.recordAsync();
    this.setState({
      capturing: false,
      captures: [videoData, ...this.state.captures],
    });
  };
  render() {
    const {flashMode, cameraType, capturing, captures} = this.state;

    return (
      <Container>
        <View style={styles.StyleCam}>
          <View>
            <RNCamera
              ref={rncamera => {
                this.camera = rncamera;
              }}
              type={cameraType}
              flashMode={flashMode}
              style={styles.preview}
              androidCameraPermissionOptions={{
                title: Language.CAMERAPAGE_TITE,
                message: Language.CAMERAPAGE_MESSAGE,
                buttonPositive: Language.CAMERA_POSITIVE,
                buttonNegative: Language.CAMERA_NEGATIVE,
              }}
              androidRecordAudioPermissionOptions={{
                title: Language.AUDIO_TITE,
                message: Language.AUDIO_MESSAGE,
                buttonPositive: Language.CAMERA_POSITIVE,
                buttonNegative: Language.CAMERA_NEGATIVE,
              }}
            />
          </View>
          <Toolbar
            capturing={capturing}
            flashMode={flashMode}
            cameraType={cameraType}
            setFlashMode={this.setFlashMode}
            setCameraType={this.setCameraType}
            onCaptureIn={this.handleCaptureIn}
            onCaptureOut={this.handleCaptureOut}
            onLongCapture={this.handleLongCapture}
            onShortCapture={this.handleShortCapture}
          />
        </View>
        <Footer>
          <FooterCamera
            actionOnPressBackItem={() =>
              this.props.navigation.navigate('NewItem')
            }
            style={styles.back}
          />
        </Footer>
      </Container>
    );
  }
}
const checkAndroidPermission = async () => {
  try {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    await PermissionsAndroid.request(permission);
    Promise.resolve();
  } catch (error) {
    Promise.reject(error);
  }
};

const {width: winWidth, height: winHeight} = Dimensions.get('window');
const styles = StyleSheet.create({
  alignCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    height: winHeight,
    width: winWidth,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  bottomToolbar: {
    width: winWidth,
    position: 'absolute',
    height: 100,
    bottom: 0,
  },
  captureBtn: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 60,
    borderColor: '#FFFFFF',
  },
  captureBtnActive: {
    width: 80,
    height: 80,
  },
  captureBtnInternal: {
    width: 76,
    height: 76,
    borderWidth: 2,
    borderRadius: 76,
    backgroundColor: 'red',
    borderColor: 'transparent',
  },
  galleryContainer: {
    bottom: 100,
  },
  galleryImageContainer: {
    width: 75,
    height: 75,
    marginRight: 5,
  },
  galleryImage: {
    width: 75,
    height: 75,
  },
  back: {
    backgroundColor: '#F5FCFF',
    alignItems: 'flex-start',
  },
  StyleCam: {
    flex: 1,
    justifyContent: 'flex-start',
  },
});
