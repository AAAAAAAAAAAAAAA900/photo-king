import { Client } from '@stomp/stompjs';
import { WS_URL } from '../api/apiClient';
/*
 following this tutorial: https://medium.com/@tusharkumar27864/best-practices-of-using-websockets-real-time-communication-in-react-native-projects-89e749ba2e3f
 but using Stomp client instead of JS websocket
*/
class WebsocketService {
    static instance = null;
    callbacks = {};
    activeSubscriptions = {};

    // singleton export
    static getInstance() {
        if (!this.instance) {
            this.instance = new WebsocketService();
        }
        return this.instance;
    }

    constructor() {
        this.socketRef = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    // initializes a stomp client connection & stores it in this.socketRef
    // returns promise to avoid race condition if subscribe called after
    connect() {
        if (this.socketRef) {
            return Promise.resolve();
        }

        const connectPromise = new Promise((resolve, reject) => {
            this.socketRef = new Client({
                debug: function (str) {
                    console.log('STOMP: ' + str);
                },
                brokerURL: WS_URL,
                onConnect: (frame) => {
                    console.log('Websocket connected');
                    this.isConnected = true;
                    this.reconnectAttempts = 0;

                    // (re)subscribe to all cached subscriptions
                    for(const destination in this.activeSubscriptions){
                        const callback = this.activeSubscriptions[destination].callback;
                        this.activeSubscriptions[destination] = {
                            subscription: this.socketRef.subscribe(destination, callback),
                            callback: callback
                        }
                    }

                    this.executeCallback('connect', null);
                    resolve();
                },
                onStompError: (frame) => {
                    console.log('Broker reported error: ' + frame.headers.message);
                    console.log('Additional headers: ' + frame.headers);

                    this.isConnected = false;
                    this.socketRef.deactivate().finally(() => {
                        this.socketRef = null;
                        this.delayReconnect();
                    });
                    this.executeCallback('error', frame);
                    reject();
                },
                onWebSocketError: (error) => {
                    console.log('WebSocket error: ' + error);

                    this.isConnected = false;
                    this.socketRef.deactivate().finally(() => {
                        this.socketRef = null;
                        this.delayReconnect();
                    });
                    this.executeCallback('error', error);
                    reject();
                },
                onWebSocketClose: (e) => {
                    console.log("Websocket closed: " + e);
                    this.isConnected = false;
                    this.socketRef = null;
                },
                forceBinaryWSFrames: true,
                appendMissingNULLonIncoming: true,
            });

            this.socketRef.activate();
        });

        return connectPromise;
    }

    // connect helper method: incrementally delays and caps reconnect attempts
    delayReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            // Exponential backoff for reconnection
            const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
            this.timeout = setTimeout(() => {
                this.reconnectAttempts++;
                this.connect();
            }, delay);
        }
    }

    // deactivates stomp client and resets state
    disconnect() {
        if (this.socketRef) {
            this.socketRef.deactivate();
            this.socketRef = null;
            this.isConnected = false;
            clearTimeout(this.timeout);
            this.activeSubscriptions = {};
        }
    }

    // wrapper for Client.publish
    publish(destination, body, headers = null) {
        if (this.isConnected && this.socketRef) {
            if (headers) {
                this.socketRef.publish({
                    destination: destination,
                    headers: headers,
                    body: body,
                });
            } else {
                this.socketRef.publish({
                    destination: destination,
                    body: body,
                });
            }
        }
    }

    // subscribes to destination with callback and caches subscription obj
    subscribe(destination, callback) {
        if (this.isConnected && !this.activeSubscriptions[destination]) {
            this.activeSubscriptions[destination] = {
                subscription: this.socketRef.subscribe(destination, callback),
                callback: callback
            };
        }
        // if not connected, cache to subscribe on reconnect 
        else if(!this.isConnected && !this.activeSubscriptions[destination]){
            this.activeSubscriptions[destination] = {
                subscription: null,
                callback: callback
            };
        }
    }

    // unsubscribes and pops subscription from cache
    unsubscribe(destination) {
        if (this.isConnected && this.activeSubscriptions[destination]?.subscription) {
            this.activeSubscriptions[destination].subscription.unsubscribe();
        }
        if(this.activeSubscriptions[destination]){
            delete this.activeSubscriptions[destination];
        }
    }

    // adds callback function 
    // called types are 'connect' and 'error'
    addCallbacks(messageType, callback) {
        if (!this.callbacks[messageType]) {
            this.callbacks[messageType] = [];
        }
        this.callbacks[messageType].push(callback);
    }

    // removes callback function
    removeCallbacks(messageType, callback) {
        if (this.callbacks[messageType]) {
            this.callbacks[messageType] = this.callbacks[messageType]
                .filter(cb => cb !== callback);
        }
    }

    // executes callbacks of given messageType
    executeCallback(messageType, data) {
        if (this.callbacks[messageType]) {
            this.callbacks[messageType].forEach(callback => callback(data));
        }
    }

}
export default WebsocketService.getInstance();