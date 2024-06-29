const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const WebSocket = require('ws');
const Y = require('yjs');
const { setupWSConnection } = require('./node_modules/y-websocket/bin/utils.cjs');

const Document = require('./models/Document'); // Import your Document model
const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

// Enable CORS
app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", require('./routes/auth'));
app.use("/api/document", require("./routes/documents"));

mongoose.connect('mongodb://localhost:27017/collaborative-editor', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

wss.on('connection', async (ws, req) => {
    const docId = req.url.split('/').pop(); // Assume document ID is passed in the URL

    // Fetch the document from MongoDB
    const dbDoc = await Document.findById(docId);
    if (!dbDoc) {
        ws.send(JSON.stringify({ type: 'error', message: 'Document not found' }));
        ws.close();
        return;
    }

    const yDoc = new Y.Doc();
    yDoc.getText('content').insert(0, dbDoc.content);
    // Send the initial content to the client
    // ws.send(JSON.stringify({ type: 'document', update: Y.encodeStateAsUpdate(yDoc) }));
    
    const setup = setupWSConnection(ws, req, { doc: yDoc });

    // Broadcast cursor updates to all connected clients
    yDoc.on('update', update => {
        const cursorUpdates = []; // Array to store cursor updates

        // Iterate through existing cursors
        setup.cursors.forEach((cursor, userId) => {
            const cursorPosition = cursor.getPosition(); // Get current cursor position
            cursorUpdates.push({ userId, cursorPosition }); // Add to update array
        });

        // Broadcast cursor updates to all clients (excluding sender)
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'cursorUpdate', updates: cursorUpdates }));
            }
        });
    });
});

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Server running on port ${port}`));
