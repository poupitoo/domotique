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
  TextInput,
  View,
  ScrollView,
  Navigator,
  BackAndroid,
  TouchableOpacity
} from 'react-native';
import { connect, Provider } from 'react-redux';
import { Map, List } from 'immutable';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';
import watch from 'redux-watch';
import store from './app/createStore';
import { addBeacon } from './app/actions/beacons';
import { addLight, fetchLights, toggleLight } from './app/actions/light';
import { addHeater, fetchHeaters } from './app/actions/heater';
import { addDoor, fetchDoors } from './app/actions/door';
import { setField } from './app/actions/addForm';
import { api_url } from './app/constants/config';
import nearestBeacon from './app/selectors/nearestBeacon';
import cordova from 'react-native-cordova-plugin';
import DeviceInfo from 'react-native-device-info';

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
  return (<View style={{flexDirection: "row"}}>
    <IonIcon name={props.state ? "ios-lightbulb" : "ios-lightbulb-outline"} size={70} />
    <Text style={{alignSelf: "center", marginLeft: 60}}>GPIO {props.gpioPin}</Text>
  </View>);
}

class ManualLight extends Component {
  componentDidMount() {
    this.props.dispatch(fetchLights());
  }
  static renderRightBtn(_, navigator) {
    return (<TouchableOpacity
        onPress={() => navigator.push({ title: 'Add Light', component: AddLight }) }
        style={styles.navBarRightButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          Add
        </Text>
      </TouchableOpacity>);
  }
  render() {
    var lights = this.props.lights.valueSeq().map((v) => {
      return (<TouchableOpacity
                key={v.get("id")}
                onPress={() => this.props.dispatch(toggleLight(v.get("id"), !v.get("state")))}>
        <Light gpioPin={v.get("gpio_pin")} state={v.get("state")} />
      </TouchableOpacity>);
    });
    return (<ScrollView>
      {lights}
    </ScrollView>);
  }
}
ManualLight = connect(state => ({ "lights": state.get("lights", List()) }))(ManualLight);

class AddLight extends Component {
  static renderRightBtn(_, navigator) {
    return (<TouchableOpacity
        onPress={() => store.dispatch(addLight(store.getState().get("addForm").get("gpio_pin"))) && navigator.pop()}
        style={styles.navBarRightButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          Done
        </Text>
      </TouchableOpacity>);
  }
  render() {
    return (<View>
        <TextInput
          onChangeText={(text) => this.props.dispatch(setField("gpio_pin", text))}
          value={this.props.addForm.get("gpio_pin")}
        />
      </View>);
  }
}
AddLight = connect(state => ({ "addForm": state.get("addForm", Map()) }))(AddLight);


function Door(props) {
  return (<View>
    <Icon name={props.state ? "lock" : "unlock"} size={70} />
    <Text>{props.name}</Text>
  </View>);
}

class ManualDoor extends Component {
  componentDidMount() {
    this.props.dispatch(fetchDoors());
  }
  static renderRightBtn() {
    return (<TouchableOpacity
        onPress={() => store.dispatch(addDoor())}
        style={styles.navBarRightButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          Add
        </Text>
      </TouchableOpacity>);
  }
  render() {
    var doors = this.props.doors.map(function(v, i) {
      return (<Door key={i} name={v.name} state={v.state} />);
    });
    return (<View>
      {doors}
    </View>);
  }
}
ManualDoor = connect(state => ({ "doors": state.get("doors", List()) }))(ManualDoor);

function Heater(props) {
  return (<View>
    <Icon name={props.state ? "server" : "server"} size={70} />
    <Text>{props.name}</Text>
  </View>);
}

class ManualHeater extends Component {
  componentDidMount() {
    this.props.dispatch(fetchHeaters());
  }
  static renderRightBtn(_, navigator) {
    return (<TouchableOpacity
        onPress={() => navigator.push({ title: 'Add Heater', component: null }) }
        style={styles.navBarRightButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          Add
        </Text>
      </TouchableOpacity>);
  }
  render() {
    var heaters = this.props.heaters.map(function(v, i) {
      return (<Heater key={i} name={v.name} state={v.state} />);
    });
    return (<View>
      {heaters}
    </View>);
  }
}
ManualHeater = connect(state => ({ "heaters": state.get("heaters", List()) }))(ManualHeater);

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
  manualHeaterOnClick() {
    this.props.navigator.push({
      title: 'Manual Heater',
      component: ManualHeater
    });
  }
  manualDoorOnClick() {
    this.props.navigator.push({
      title: 'Manual Door',
      component: ManualDoor
    });
  }
  render() {
    return (<View>
      <Icon.Button name="calendar" onPress={this.schedulesOnClick.bind(this)} size={70}>Schedules</Icon.Button>
      <Icon.Button name="lightbulb-o" onPress={this.manualLightOnClick.bind(this)} size={70}>Manual Light</Icon.Button>
      <Icon.Button name="server" onPress={this.manualHeaterOnClick.bind(this)} size={70}>Manual Heater</Icon.Button>
      <Icon.Button name="lock" onPress={this.manualDoorOnClick.bind(this)} size={70}>Manual Door</Icon.Button>
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
      return route.component.renderRightBtn(route, navigator, index, navState);
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

cordova.evothings.eddystone.startScan(function(beacon) {
  // Update beacon data.
  beacon.timeStamp = Date.now();
  store.dispatch(addBeacon(beacon));
}, function(error) {
  console.error('Eddystone scan error: ', error);
});

const watchNearestBeacon = watch(() => {
  if (nearestBeacon(store.getState()) != null)
    return nearestBeacon(store.getState()).get("address");
  else
    return null;
});
store.subscribe(watchNearestBeacon(newVal => {
  const form = new FormData();
  form.append('beacon', newVal);
  form.append('device', DeviceInfo.getUniqueID());
  fetch(`${api_url}/nearestBeacon`, {
    method: 'POST',
    body: form
  });
}));

// domotic is the root Component that will be shown
AppRegistry.registerComponent('domotic', () => domotic);
