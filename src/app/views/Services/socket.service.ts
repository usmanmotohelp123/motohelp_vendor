import { inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

private socket!: Socket;

constructor(private authService:AuthService) {
  console.log("SocketService instance created");
}

// connect(customerId: string) {
//   console.log("connect called");
// // http://192.168.1.107:8084 https://uat.motohelpindia.com https://uat.motohelpindia.com 
//   this.socket = io("https://stag.motohelpindia.com", {
//     transports: ["websocket"],
//     autoConnect: true
//   });

//   console.log("Socket object:", this.socket);

//   this.socket.on("connect", () => {
//     console.log("CONNECTED");
//     console.log(this.socket.id);

//     this.socket.emit("join", {
//       userId: customerId,
//       role: "customer"
//     });
//   });

//   this.socket.on("connect_error", err => {
//     console.log("CONNECT ERROR");
//     console.log(err);
//   });

//   this.socket.on("error", err => {
//     console.log("SOCKET ERROR");
//     console.log(err);
//   });
// }

  connect(customerId: string) {
    // const token = localStorage.getItem('accessToken');
    const token = this.authService.getToken();
    console.log('Connecting socket...');
    console.log('Token available:', !!token);
    this.socket = io('https://stag.motohelpindia.com', {
      transports: ['websocket'],
      auth: {
        token: token
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: true,
      autoConnect: true
    });
    this.socket.on('connect', () => {
      console.log('SOCKET CONNECTED');
      console.log('Socket ID:', this.socket.id);
      this.socket.emit('join', {
        userId: customerId,
        role: 'customer'
      });
    });
    this.socket.on('connect_error', (error: any) => {
      console.error(' SOCKET CONNECT ERROR');
      console.error('Message:', error?.message);
      console.error('Error:', error);
    });

    this.socket.on('error', (error: any) => {
      console.error('SOCKET ERROR:', error);
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('SOCKET DISCONNECTED:', reason);
    });
  }


emitWhenConnected(event: string,data: any,callback?: (response: any) => void) {
  if (!this.socket) {
    console.error('Socket is not initialized');
    return;
  }
  if (this.socket.connected) {
    console.log('Emitting:', event);
    console.log('Payload:', data);
    this.socket.emit(event, data, callback);
    console.log('Emitted:', event);
  } else {
    console.log('Socket not connected. Waiting...');
    this.socket.once('connect', () => {
      console.log('Connected. Emitting:', event);
      this.socket.emit(event, data, callback);
      console.log('Emitted:', event);
    });
  }
}

emitWhenConnected2(event: string, payload: any) {
   console.log(this.socket);
    if (!this.socket) {
      console.log("Socket not initialized");
      return;
    }
    if (this.socket.connected) {
      this.socket.emit(event, payload);
    } 
    else {
      this.socket.once('connect', () => {
        this.socket.emit(event, payload);
      });
    }
 }


listen(event: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on(event, data => {
        observer.next(data);
      });
      return () => {
        this.socket.off(event);
      };
    });
  }

 disconnect(): void {
  if (this.socket) {
    this.socket.removeAllListeners(); 
    this.socket.disconnect();         
    this.socket = undefined as any;  
    console.log('Socket disconnected');
   }
 }

 
}