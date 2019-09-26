import React, { Component } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import styles from "./stylesheet.js";

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: "Welcome"
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text> Welcome! </Text>
        <Button
          title="Click here to start the app"
          onPress={() =>
            navigate("Profile")
          }
        />
      </View>
    );
  }
}
