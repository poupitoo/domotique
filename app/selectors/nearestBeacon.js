export default function nearestBeacon(store) {
  return store.get("beacons").reduce((red, val) => {
    if (red === null)         return val;
    if (red.rssi > val.rssi)  return red;
    else                      return val;
  }, null);
}
