console.info('os', Deno.build.os);

Deno.serve({
    hostname: '127.0.0.1',
    port: 9999,
    onListen: () => {
        console.info('Listening on ws://0.0.0.0:9999 ...');
    },
    handler: (req) => {
        if (req.headers.get("upgrade") != "websocket") {
            return new Response(null, { status: 501 });
        }

        const { socket, response } = Deno.upgradeWebSocket(req);

        socket.addEventListener("open", () => {
            console.log("a client connected!");
        });

        socket.addEventListener("message", (event) => {
            if (event.data === "ping") {
                socket.send("pong");
                return;
            }

            console.info('coś dziwnego dotarło', event.data);
        });

        socket.addEventListener('close', (cv) => {
            console.info('close', cv);
        });

        socket.addEventListener('error', error => {
            console.info('error', error);
        });

        return response;
    }
});

/*
    dwa rodzaje zasobów

    obserwowanie jakiegoś parametru serwera ...

    odpalenie "taska" który będzie składał się z trzech procesów, potem obserwowanie stanu tego taska


*/
