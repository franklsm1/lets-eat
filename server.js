import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import configureSockets from "./src/configureSockets.js";

const PORT = process.env.PORT || 9000;
const PATH = 'client/build';
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // when using type modules __dirname no longer exists


app.use(cors());
app.use(helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                "script-src": ["'self'", "'unsafe-eval'", "https://maps.googleapis.com", "https://maps.gstatic.com", "https://fonts.googleapis.com"],
                "img-src": ["'self'", "blob:", "data:",  "https://*.googleapis.com", "https://maps.gstatic.com"]
            },
        }
    })
);
app.use(express.static(path.join(__dirname, `./${PATH}`)));
const server = app.listen(PORT, '0.0.0.0');

console.log('Express server listening on port %d in %s mode', PORT, app.settings.env); // eslint-disable-line no-console

app.get('*', (req, res) => {
    console.log(req.url);
    res.sendFile(path.join(__dirname, `./${PATH}/index.html`));
});

const socket = new Server(server)
configureSockets(socket);
