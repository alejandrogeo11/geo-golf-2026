# GEO Golf 2026 Online — prototipo

## Prueba en tu Mac
1. Instala Node.js 22 LTS o posterior compatible desde https://nodejs.org/.
2. Descomprime esta carpeta. Abre Terminal, escribe `cd ` (con espacio), arrastra la carpeta a Terminal y pulsa Enter.
3. Ejecuta `npm start` y abre http://localhost:3000 en Chrome, en dos ventanas.
4. Introduce nombres diferentes. Crea sala en una ventana y escribe el código en la otra. El anfitrión pulsa Empezar torneo online.
5. Arrastra la bola hacia atrás y suelta; espera a que termine el golpe. El siguiente jugador tira en el mismo hoyo. El anfitrión pulsa Siguiente hoyo cuando todos terminan.

## Publicar en Internet
Crea un repositorio en GitHub, sube los cuatro archivos del proyecto (index.html, server.js, package.json, render.yaml) y crea un Web Service de Node en Render desde ese repositorio. Build command: `npm install`. Start command: `npm start`. Usa el puerto PORT proporcionado por el alojamiento (automático). Comparte la URL HTTPS que te asigne Render. No compartas localhost: solo funciona en tu ordenador. Puedes usar cualquier alojamiento compatible con Node.js. Comprueba los precios y límites del plan antes de contratar.

## Alcance y limitaciones
Modo local y salas online privadas de 2 a 4 personas. No requiere dependencias npm externas. Sincronización por HTTP polling (100 ms), no WebSockets. El anfitrión simula la física; el servidor controla identidad, sala y permiso de golpe, pero no garantiza protección contra trampas del anfitrión. Mantén la pestaña del anfitrión abierta y visible. Las salas son temporales en memoria, se pierden si se reinicia el servidor; no hay reconexión tras recargar, migración de anfitrión ni ranking global. La interfaz y el campo proceden de la versión multijugador anterior. No se ha verificado una partida completa en navegadores por las restricciones de red del entorno de prueba.
