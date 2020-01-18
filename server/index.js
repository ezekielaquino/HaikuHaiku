const express = require('express');
const sanityClient = require('@sanity/client');
const cors = require('cors');
const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');
const dotenv = require('dotenv');

dotenv.config();

const client = sanityClient({
  projectId: process.env.SANITY_ID,
  dataset: 'production',
  token: process.env.SANITY_TOKEN,
});

const queries = {
  compositions: `*[_type=="composition"]|order(_updatedAt desc)`,
};

const app = express();

app.use(cors());
app.use(express.text())
app.use(express.json())
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

app.get('/compositions', (err, res) => {
  client.fetch(queries.compositions)
    .then(response => {
      res.status(200);
      res.json(response);
      res.end();
    });
});

app.post('/create', (req, res) => {
  const {
    passage,
    user,
  } = req.body;

  return client.create({
    _type: 'composition',
    passages: [
      {
        _key: `${passage}-${user}`,
        _type: 'passage',
        editable: true,
        content: passage,
        user,
      },
    ],
  })
    .then(response => {
      res.status(200);
      res.json(response);
      res.end();
    })
});

app.post('/update', (req, res) => {
  const {
    user,
    passage,
    compositionId,
  } = req.body;
  
  return client
    .patch(compositionId)
    .append('passages', [
      {
        _key: uuidv4(),
        _type: 'passage',
        content: passage,
        user,
      },
    ])
    .commit()
    .then(response => {
      res.status(200);
      res.json(response);
      res.end();
    });
});

app.post('/close', (req, res) => {
  console.log('CLOSE CONNEECTION');
});

const server = app.listen(process.env.PORT || 8080);

const wss = new WebSocket.Server({ server });
wss.on('connection', (ws, request, client) => {
  ws.id = uuidv4();
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  ws.on('message', event => {
    const data = JSON.parse(event);

    if (data.type === 'register') {
      broadcastClientActivity();
    }

    if (data.type === 'editing') {
      ws.editing = data.compositionId;
      broadcastClientActivity();
    }
  });

  ws.on('close', event => {
    broadcastClientActivity();
  });
});

client.listen(queries.compositions).subscribe(data => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'update',
        mutation: data,
      }));
    }
  });
});

const interval = setInterval(() => {
  wss.clients.forEach(ws => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping(() => {});
  });
}, 30000);

function heartbeat() {
  this.isAlive = true;
}

function broadcastClientActivity() {
  const clients = [...wss.clients].map(client => {
    return {
      id: client.id,
      editing: client.editing,
    };
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'registrations',
        clients,
      }));
    }
  });
}
