/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Navigator,
  BackAndroid,
  TouchableOpacity
} from 'react-native';
import { connect, Provider } from 'react-redux';
import { List } from 'immutable';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';
import store from './app/createStore';
import { addLight, fetchLights } from './app/actions/light';

/*
 * This application is written using the React/Redux combo.
 * React is used as the V part of MVC. Redux is the C and M.
 * Redux is split in "actions" and "reducers". The idea is that actions
 * are sent to the redux store, which will update its storage in a reducer.
 * You can think of it as an infinite List on which we apply a reduce algorithm.
 *
 * Each time the Redux store is updated, a new render will be called thanks to
 * the "connect" function.
 */
class Schedule {
  render() {
    return (<View>
      At : <Button>{this.props.at}</Button>
      To : <Button>{this.props.to}</Button>
    </View>);
  }
}

// TODO: Convert state to redux
class Schedules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "schedules": []
    };
  }
  render() {
    var schedules = this.state.schedules.map(function(v) {
      return (<Schedule name={v.name} at={v.at} to={v.to} />);
    });
    return (<View>
      {schedules}
    </View>);
  }
}

function Light(props) {
  return (<View>
    <IonIcon name={props.state ? "ios-lightbulb" : "ios-lightbulb-outline"} size={70} />
    <Text>{props.name}</Text>
  </View>);
}

class ManualLight extends Component {
  componentDidMount() {
    this.props.dispatch(fetchLights());
  }
  static renderRightBtn() {
    return (<TouchableOpacity
        onPress={() => store.dispatch(addLight())}
        style={styles.navBarRightButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          Add
        </Text>
      </TouchableOpacity>);
  }
  render() {
    var lights = this.props.lights.map(function(v, i) {
      return (<Light key={i} name={v.name} state={v.state} />);
    });
    return (<View>
      {lights}
    </View>);
  }
}
ManualLight = connect(state => ({ "lights": state.get("lights", List()) }))(ManualLight);

// The Home page. Contains links to the other pages.
class Home extends Component {
  schedulesOnClick() {
    this.props.navigator.push({
      title: 'Schedules',
      component: Schedules
    });
  }
  manualLightOnClick() {
    this.props.navigator.push({
      title: 'Manual Light',
      component: ManualLight
    });
  }
  render() {
    return (<View>
      <Icon.Button name="lightbulb-o" onPress={this.schedulesOnClick.bind(this)} size={70}>Schedules</Icon.Button>
      <Icon.Button name="lightbulb-o" onPress={this.manualLightOnClick.bind(this)} size={70}>Manual Light</Icon.Button>
      <Icon name="lightbulb-o" onPress={this.onClick} size={70}/>
    </View>);
  }
}

// The configuration for the top navigation bar.
const NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    if (index <= 0)
      return null;
    const previousRoute = navState.routeStack[index - 1];
    return (
      <TouchableOpacity
        onPress={navigator.pop}
        style={styles.navBarLeftButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          {previousRoute.title}
        </Text>
      </TouchableOpacity>
    );
  },
  RightButton(route, navigator, index, navState) {
    if (route.component.renderRightBtn)
      return route.component.renderRightBtn();
  },
  Title(route, navigator, index, navState) {
    return (<Text style={[styles.navBarText, styles.navBarTitleText]}>{route.title}</Text>);
  }
};

// The top-level component. Wraps Provider
class domotic extends Component {
  render() {
    // The provider allows access to the Redux store
    // thanks the the connect() function.
    return (
      <Provider store={store}>
        <Navigator
          initialRoute={{ title: 'Home', component: Home }}
          renderScene={(route, navigator) => {
            if (route.component)
              return (<View style={styles.scene}>
                {React.createElement(route.component, { navigator })}
              </View>);
            else
              return <Text style={styles.scene}>No such route</Text>;
          }}
          navigationBar={<Navigator.NavigationBar
            routeMapper={NavigationBarRouteMapper}
            style={styles.navBar}
            />}
        />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: 'white'
  },
  navBarLeftButton: {
    paddingLeft: 10
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarButtonText: {
    color: require('cssVar')('fbui-accent-blue'),
  },
  navBarTitleText: {
    color: require('cssVar')('fbui-bluegray-60'),
    fontWeight: '500',
    marginVertical: 9
  },
  scene: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#EAEAEA'
  }
});

// domotic is the root Component that will be shown
AppRegistry.registerComponent('domotic', () => domotic);
