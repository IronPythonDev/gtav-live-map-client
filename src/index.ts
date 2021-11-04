import { HubConnectionBuilder, HttpTransportType, HubConnection, HubConnectionState } from '@microsoft/signalr';
import axios from 'axios';

export class ConnectionOptions {
    url: string = 'https://api.gtavlivemap.com';
    endpoint: string | null = '/ws/map';
    apiKey: string = '';
    apiVersion: string = 'v1';
}

class GTAVLiveMapHTTPClient {
    public connectionOptions: ConnectionOptions;

    private url: string;

    constructor(options: ConnectionOptions) {
        this.connectionOptions = options;

        this.url = this.connectionOptions.url;
    }

    createAction(name: string, description: string = '' , src: string = '') {
        return axios.post(this.url + `/${this.connectionOptions.apiVersion}/maps/apiKey/actions`, {
            "Name": name,
            "Description": description,
            "Source": src
        }, {
            headers: {
                'ApiKey': this.connectionOptions.apiKey
            }
        });
    }
}

export class GTAVLiveMapClient {
    public connectionOptions: ConnectionOptions;
    public connection: HubConnection | null;
    public httpClient: GTAVLiveMapHTTPClient;

    private onSuccessfullyConnected: () => void = () => { };
    private onDisconnected: (e: any) => void = () => { };
    private onFailedConnect: (r: any, interval: NodeJS.Timer) => void = (r, i) => { };

    constructor(options: ConnectionOptions) {
        if (options === null) throw 'options is null';

        this.connectionOptions = options;
        this.connection = null;
        this.httpClient = new GTAVLiveMapHTTPClient(options);
    }

    build(): GTAVLiveMapClient {
        const url = this.connectionOptions.url;

        this.connection = new HubConnectionBuilder()
            .withUrl(url + this.connectionOptions.endpoint + `?apiKey=${this.connectionOptions.apiKey}`, {
                withCredentials: false,
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .build();

        return this;
    }

    registerAutoReconnect(interval: number = 1000, onSuccess: () => void = () => { }, onFailed: (r: any, interval: NodeJS.Timer) => void = () => { }) {
        if (this.connection === null) throw 'Connection is null';

        this.connection.onclose((e) => {
            this.onDisconnected(e);

            const reconnectInterval = setInterval(() => {
                this.connectToServer().then(v => {
                    clearInterval(reconnectInterval);
                    onSuccess();
                }).catch(e => onFailed(e, reconnectInterval));
            }, interval)
        })

        return this;
    }

    registerOnConnected(callback: () => void) {
        if (this.connection === null) throw 'Connection is null';

        this.registerLocalAction('OnConnected', callback);
        this.onSuccessfullyConnected = callback;

        return this;
    }

    registerOnDisconnected(callback: (e: any) => void){
        this.onDisconnected = callback;

        return this;
    }

    registerOnFailedConnect(callback: (r: any, interval: NodeJS.Timer) => void) {
        if (this.connection === null) throw 'Connection is null';

        this.onFailedConnect = callback;

        return this;
    }

    connectToServerWithWaitConnection(interval: number = 1000) {
        const connectInterval = setInterval(() => {
            if (this.connection?.state === HubConnectionState.Connecting) return;

            this.connectToServer()
                .then(() => {
                    this.onSuccessfullyConnected();
                    clearInterval(connectInterval)
                })
                .catch((r) => this.onFailedConnect(r, connectInterval))
        }, interval)

        return this;
    }

    connectToServer(): Promise<void> {
        if (this.connection === null) throw 'Connection is null';

        return this.connection.start();
    }

    registerLocalAction(name: string, handler: (...args: any[]) => void){
        if (this.connection === null) throw 'Connection is null';

        this.connection.on(name, handler);

        return this;
    }

    registerGlobalAction(name: string, handler: (...args: any[]) => void , onFailed: (e: any) => void = (e) => {}): GTAVLiveMapClient {
        if (this.connection === null) throw 'Connection is null';

        this.httpClient.createAction(name, '' , handler.toString()).then(v => {
            if (this.connection === null) return;

            this.connection.on(name, handler);
        }).catch(e => onFailed(e));

        return this;
    }

    invoke(methodName: string, ...args: any[]) {
        if (this.connection === null) throw 'Connection is null';

        return this.connection?.invoke(methodName, args);
    }

    send(methodName: string, ...args: any[]) {
        if (this.connection === null) throw 'Connection is null';

        return this.connection?.send(methodName, args);
    }
}
