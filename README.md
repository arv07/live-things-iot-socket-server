# Live Things Iot

Live Thigns Iot nace como una motivación y gusto por el Iot internet de las cosas o Internet Of Things, y de igual manera por poner en práctica los conocimientos en programación desde una perspectiva full stack.

Este Proyecto engloba todo el desarrollo de la plataforma para la conexión de los dispositivos Iot así como el desarrollo de cada uno de los dispositivos pasando desde el prototipo hasta el diseño e implementación de placas PCB para darle un terminado más profesional.

## Diagrama general de despliegue

![App Screenshot](https://firebasestorage.googleapis.com/v0/b/landingarv.appspot.com/o/live-things-iot-img%2Flive-things-iot-general.png?alt=media&token=7c866de8-123d-47d8-ba04-200cbf60bd71)


## 🔗 Otros recursos
- [Api Server](https://github.com/arv07/live-things-iot-api-server)
- [NodeJs Server (Sockets)](https://github.com/arv07/live-things-iot-socket-server)
- [Mobile App](https://github.com/arv07/live-things-iot-mobile-app)
- Dispositivos
    - [DRL1 - (Bombillo Relé)](https://github.com/arv07/live-things-iot-drl1)


## Socket Server

Desarrollado con Express Js y la librería socketio. Este servicio permite la comunicación en tiempo real entre el dispositivo y la aplicación móvil para responder a los diferentes eventos.
Por ejemplo, si desde la aplicación se acciona el botón para encender el bombillo, este servicio recibe la solicitud, busca el dispositivo asociado y manda la acción para que desde esp8266 sea recibida al instante y ejecuta la acción de encender el relé.

Nota: Actualmente este servicio gestiona los id socket, que identifica cada conexión, mediante una base de datos transaccional, pero es ideal que se implemente un sistema como Redis para mayor escalamiento y rapidez.
