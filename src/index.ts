import { HubConnectionBuilder, HttpTransportType, HubConnection } from '@microsoft/signalr';

export class ConnectionOptions {
    host: string = 'http://localhost';
    port: number = 80;
    url: string | null = null;
    endpoint: string | null = '/ws/map';
    apiKey: string = '';
}

export class GTAVLiveMapClient {
    private connectionOptions: ConnectionOptions;
    private connection: HubConnection | null;

    constructor(options: ConnectionOptions) {
        if (options === null) throw 'options is null';

        this.connectionOptions = options;
        this.connection = null;
    }

    build(): GTAVLiveMapClient {
        const url = this.connectionOptions.url ?? `${this.connectionOptions.host}:${this.connectionOptions.port}`;

        this.connection = new HubConnectionBuilder()
            .withUrl(url + this.connectionOptions.endpoint + `?apiKey=${this.connectionOptions.apiKey}`, {
                withCredentials: false,
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .build();

        return this;
    }

    connectToServer(): Promise<void> {
        if (this.connection === null) throw 'Connection is null';

        return this.connection.start();
    }

    registerAction(name: string, handler: (...args: any[]) => void): GTAVLiveMapClient {
        if (this.connection === null) throw 'Connection is null';

        //add this action to DB

        this.connection.on(name, handler);

        return this;
    }

    sendObjectCord(obj: any, pos: { x: number, y: number, z: number }): void {
        if (this.connection === null) throw 'Connection is null';

        this.emitServer('UpdateObjectPosition', obj, pos);
    }

    sendObject(obj: any): void {
        if (this.connection === null) throw 'Connection is null';

        this.emitServer('UpdateObject', obj);
    }

    private emitServer(methodName: string, ...args: any[]) {
        if (this.connection === null) throw 'Connection is null';
        
        this.connection?.send(methodName, args);
    }
}
