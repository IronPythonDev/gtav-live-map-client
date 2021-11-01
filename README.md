#### Examples

```ts
import { ConnectionOptions, GTAVLiveMapClient } from '../dist/index.js';

let options = new ConnectionOptions();

options.url = 'http://localhost:8090';
options.apiKey = 'vlgRbFEWdkSv98hDRqxlCdKKKxJoRL';

let client = new GTAVLiveMapClient(options)
  .build()
  .registerAutoReconnect(2000, () => {
    console.log('Connection restored successfully');
  })
  .registerOnConnected(() => {
    console.log('Successfully connected to map');
  })
  .registerOnFailedConnect((r, i) => {
    console.log('Failed');
  })
  .connectToServerWithWaitConnection(2000)
  .registerGlobalAction(
    'CustomAction',
    (args) => {
      console.log('Hello World');
    },
    (e) => {
      console.log(`Error: ` + e.response.data);
    },
  )
  .registerGlobalAction(
    'CustomAction1',
    (args) => {
      console.log('Hello World');
    },
    (e) => {
      console.log(`Error: ` + e.response.data);
    },
  );
```