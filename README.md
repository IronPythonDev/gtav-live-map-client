#### Examples

```ts
let options = new ConnectionOptions();

options.port = 49154;

let client = new GTAVLiveMapClient(options)
    .build()
    .registerAction('OnUpdateMarker', (position: {x: number , y: number , z: number}) => {
        console.log(`ObjectPosition => ${position.x}:${position.y}:${position.z}`);
    })
    .registerAction('KickPlayer', (playerId: number) => {
        console.log(`Kik => ${playerId}`);
    });

client
    .connectToServer()
    .then((v) => {
        console.log(`Successfully connected`);
    })
    .catch((r) => {
        console.log(`Failed connected => Reason: ${r}`);
    });
```