# GTAVLiveMapWSClient v1

GTAVLiveMapWSClient is a client for working with the endpoint api.gtavlivemap.com/ws/map

```shell
$ npm i gtav-live-map-ws-client
```

# Using

```ts 
// Import connect config and client
import { ConnectionOptions, GTAVLiveMapClient } from "gtav-live-map-ws-client";

// Create config 
let options = new ConnectionOptions()

// Set a apiKey property , the apiKey can be take from a map dashboard
options.apiKey = 'apiKey';

// Create client and put option to constructor
let client = new GTAVLiveMapClient(options)
  //Create client and put connection config to constructor
  .build()
  //[OPTIONAL] Add auto reconnect if connection will be lost
  .registerAutoReconnect(1000 , () => {})In args, you need to pass the connection interval
  //[OPTIONAL] Add a callback which will triggering after every successfully connected to server
  .registerOnConnected(() => {})
  //[OPTIONAL] Add a callback which will be triggering after failed connected to server. reason - reason of failed connect, interval - connect interval(Type of NodeJS.Timer)
  .registerOnFailedConnect((reason , interval) => {})
  //Start connection to server, which will try to connect to server if connection failed. 
  .connectToServerWithWaitConnection(2000)
  //[OPTIONAL] Create action which triggered from API . In args, you need to pass name of action , callback and handler for failed create action
  .registerGlobalAction('name' , (args) => {} , (err) => {})
```

