import { Injectable } from '@angular/core';

import autobahn from 'autobahn-browser';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  connection: autobahn.Connection;
  session: autobahn.Session;
  dirty: boolean;

  constructor() {
    // the WAMP connection
    this.connection = new autobahn.Connection({
      url: environment.wampUrl,
      realm: environment.wampRealm
    });

    this.connection.onopen = (session: autobahn.Session) => {
      console.log('Connected');
      this.session = session;
    };

    this.connection.onclose = (reason: string) => {
      console.log('Connection closed: ' + reason);
      return true;
    };

    this.connection.open();
  }

  /*
   * Publish to a WAMP topic
   */
  async publish(topic: string, data: any) {
    const session = await this.isConnected();

    session.publish(topic, data);
  }

  /*
   * Subscribe to a WAMP topic
   */
  async subscribe(topic: string, callback: (args: any) => void) {
    const session = await this.isConnected();

    session.subscribe(topic, callback).then(
      () => console.log(`Subscribed to ${topic}`),
      (err: string) => console.log(`Failed to subscribe to ${topic}: ${err}`)
    );
  }

  /*
   * Returns a promise fulfilling as soon as the connection stands
   * (i.e. when the session is defined)
   */
  private isConnected() {
    return new Promise<autobahn.Session>(resolve => {
      const loop = () => {
        if (this.session) {
          resolve(this.session);
        } else {
          setTimeout(loop, 50);
        }
      };
      loop();
    });
  }

}
