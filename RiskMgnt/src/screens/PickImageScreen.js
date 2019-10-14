import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  Alert,
} from 'react-native';

import CameraRoll from '@react-native-community/cameraroll';
import PhotoGrid from 'react-native-image-grid';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Container, Footer} from 'native-base';
import * as Define from '../components/locales/Language.json';
import HeaderForm from '../containers/Header';
import FooterCamera from '../components/form/FooterCamera';
import Check from '../images/tick-circle.png';
import unCheck from '../images/circle.png';

export default class PickImage extends Component {
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
      images: [],
      isCameraLoaded: false,
    };
  }

  componentDidMount = async () => {
    if (Platform.OS === 'android') {
      await checkAndroidPermission();
    }
    CameraRoll.getPhotos({first: 100}).then(
      data => {
        const assets = data.edges;
        const images = assets.map(asset => asset.node.image);
        console.log('data getPhotos: ', data);
        console.log('assets getPhotos: ', assets);
        console.log('images getPhotos: ', images);

        images.forEach(function(itm) {
          itm.isSelected = false;
        });

        console.log('images addProperty: ', images);
        this.setState({
          isCameraLoaded: true,
          images: images,
        });
      },
      error => {
        console.log('error getPhotos: ', error);
      },
    );
  };

  _onPressCheck = item => {
    var CountMaxChoose = 0;

    this.state.images.forEach(function(itm) {
      if (itm.isSelected === true) {
        CountMaxChoose++;
      }
    });
    console.log('CountMaxChoose : ', CountMaxChoose);
    //    if (CountMaxChoose >= 3 && item.isSelected === false) {
    //      Alert.alert(Define.WARNING_MAX_IMAGE);
    //      console.log('images onclick1: ', this.state.images);
    //      return;
    //    }

    item.isSelected = !item.isSelected;

    const index = this.state.images.findIndex(
      items => item.filename === items.filename,
    );
    console.log('index Photo: ', index);

    this.state.images[index] = item;
    this.setState({
      images: this.state.images,
    });

    console.log('images onclick2: ', this.state.images);
  };

  renderItem = (item, itemSize, itemPaddingHorizontal) => {
    return (
      <TouchableOpacity
        style={{
          width: itemSize,
          height: itemSize,
          paddingHorizontal: itemPaddingHorizontal + 10,
          paddingVertical: itemPaddingHorizontal + 10,
        }}
        onPress={() => this._onPressCheck(item)}>
        <Image resizeMode="cover" style={{flex: 1}} source={{uri: item.uri}} />
        {item.isSelected ? (
          <Image source={Check} style={styles.checkbox} />
        ) : (
          <Image source={unCheck} style={styles.checkbox} />
        )}
      </TouchableOpacity>
    );
  };

  render() {
    if (!this.state.isCameraLoaded) {
      return (
        <View style={styles.container1}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <Container>
        <View style={styles.StylePic}>
          <Text>{Define.PLEASE_SELECT_IMAGE}</Text>
          <PhotoGrid
            data={this.state.images}
            itemsPerRow={2}
            itemMargin={1}
            itemPaddingHorizontal={1}
            renderItem={this.renderItem}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    paddingHorizontal: 10,
  },
  listContainer: {
    alignItems: 'center',
  },
  back: {
    backgroundColor: '#F5FCFF',
    alignItems: 'flex-start',
  },
  separator: {
    marginTop: 10,
  },
  /******** card **************/
  card: {
    marginVertical: 8,
    backgroundColor: 'white',
    flexBasis: '45%',
    marginHorizontal: 10,
  },
  cardContent: {
    paddingVertical: 17,
    justifyContent: 'space-between',
  },
  cardImage: {
    flex: 1,
    height: 150,
    width: null,
  },
  imageContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  /******** card components **************/
  title: {
    fontSize: 18,
    flex: 1,
    color: '#778899',
  },
  count: {
    fontSize: 18,
    flex: 1,
    color: '#B0C4DE',
  },
  checkbox: {
    position: 'absolute',
    alignSelf: 'flex-end',
    height: 25,
    width: 25,
    padding: 10,
  },
  container1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  StylePic: {
    flex: 1,
    justifyContent: 'flex-start',
    margin: 5,
  },
});
