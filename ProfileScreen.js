import React, { Component } from "react";
import { Button, Text, View, Image, ImageBackground } from "react-native";
import styles from "./stylesheet.js";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as FaceDetector from "expo-face-detector";
// import Canvas from "react-native-canvas";

// import { vw, vh, vmin, vmax } from "react-native-viewport-units";

export default class ProfileScreen extends Component {
  state = {
    image: null
  };

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      //   await Permissions.askAsync(Permissions.CAMERA);
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3]
    });
    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri }, () => {
        this.detectFaces(this.state.image);
      });
      this.setState({ imageDets: result });
    }
  };

  //   handleCanvas = canvas => {
  //     const ctx = canvas.getContext("2d");
  //     if (this.state.image) {
  //       var img = new Image();
  //       img.onload = function() {
  //         ctx.drawImage(img, 0, 0);
  //       };
  //       img.src = this.state.image;
  //     }
  //   };

  detectFaces = imageUri => {
    const options = { mode: FaceDetector.Constants.Mode.accurate };
    FaceDetector.detectFacesAsync(imageUri, options).then(r => {
      console.log(r.faces);
      this.setState({ boxArray: r.faces });
    });
  };

  render() {
    let { image } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
        {image ? (
          <ImageBackground
            source={{ uri: image }}
            style={{ width: 400, height: 300 }}
          >
            {this.state.boxArray ? (
              this.state.boxArray.map(e => {
                return (
                  <View
                    key={e.bounds.origin.x}
                    style={{
                      position: "absolute",
                      marginLeft:
                        (e.bounds.origin.x / this.state.imageDets.width) * 400,
                      marginTop:
                        (e.bounds.origin.y / this.state.imageDets.height) * 300,
                      width:
                        (e.bounds.size.width / this.state.imageDets.width) *
                        400,
                      height:
                        (e.bounds.size.height / this.state.imageDets.height) *
                        300,
                      borderWidth: 0.5,
                      borderColor: "#d6d7da"
                    }}
                  />
                );
              })
            ) : (
              <></>
            )}
          </ImageBackground>
        ) : (
          <></>
        )}
      </View>
    );
  }
}
