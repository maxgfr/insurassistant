require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const socket = require('socket.io');
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cors()); // enable cors
const port = process.env.PORT || '3000';
const AssistantV2 = require('ibm-watson/assistant/v2');
const assistant = new AssistantV2({
  version: '2019-02-28',
  iam_apikey: process.env.ASSISTANT_APIKEY,
  url: process.env.ASSISTANT_URL
});
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
const toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  iam_apikey: process.env.TONE_API_KEY,
  url: 'https://gateway-lon.watsonplatform.net/tone-analyzer/api'
});
const Cloudant = require('@cloudant/cloudant');
const cloudant = Cloudant({
  account: process.env.CLOUDANT_ACCOUNT,
  password: process.env.CLOUDANT_PASSWORD
});
cloudant.db.create(process.env.DB_NAME, function(err, data) {
  if(!err)
    console.log("Database created.");
});
const my_db = cloudant.db.use(process.env.DB_NAME);

app.get('/test-db', (req, res) => {
  cloudant.db.list()
    .then((body) => {
      var list = [];
      body.forEach((db) => {
        list.push(db);
      });
      res.json({result: list});
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/', (req, res) => {
  res.json({success: true, data: {status: 'avalaible'}})
});

app.post('/tone', (req, res) => {
  if(!req.body) {
    res.json({success: false, message: 'no body'});
    return;
  }
  const toneParams = {
    tone_input: { 'text': req.body.message },
    content_type: 'application/json',
    content_language: "fr"
  };
  toneAnalyzer.tone(toneParams)
    .then(toneAnalysis => {
      //console.log(JSON.stringify(toneAnalysis, null, 2));
      res.json({success: true, result: toneAnalysis});
    })
    .catch(err => {
      //console.log('error:', err);
      res.json({success: false, message: err});
    });
});

app.get('/create-session', (req, res) => {
  assistant.createSession({ assistant_id: process.env.ASSISTANT_ID }, (err, response) => {
      if (err) {
        res.json({success: false, error: err});
      } else {
        res.json({success: true, data: response});
      }
    });
});

app.post('/send-message', (req, res) => {
  if(!req.body || !req.body.session_id || !req.body.context || !req.body.message) {
    res.json({success: false, error: 'session_id or context or message is not set in the body'});
  } else {
    assistant.message(
      {
        assistant_id: process.env.ASSISTANT_ID,
        session_id: req.body.session_id,
        context: req.body.context,
        input: {
          'message_type': 'text',
          'text': req.body.message,
          'options': {
            'return_context': true
          }
        }
      },
      (err, response)  => {
        if (err) {
          res.json({success: false, error: err});
        } else {
          res.json({success: true, data: response});
        }
      }
    );
  }
});

app.get('/get-data', (req, res) => {
  console.log(req.query)
  my_db.find({ selector: req.query }, (err, result) => {
    if (!err) {
      var data  = [];
      for (var i = 0; i < result.docs.length; i++) {
        data.push(result.docs[i]);
      }
      res.json({success: true, data: data});
    } else {
      res.json({success: false, error: err});
    }
  });
});

app.post('/save-data', (req, res) => {
  if(!req.body) {
    res.json({success: false, error: 'no body'});
  } else {
    my_db.insert(req.body, (err, body, header) => {
      if (err) {
        res.json({success: false, error: err.message});
      } else {
        res.json({success: true, data: req.body});
      }
    });
  }
});

const server = app.listen(port, () => console.log(`Express app is listening on port ${port}!`));

const io = socket(server);

io.on('connection', (socket) => {

  socket.on('send', (msg) => {
      socket.broadcast.emit('new_message', msg);
  });

  socket.on('tone', (data) => {
      socket.broadcast.emit('new_tone', data);
  });

  socket.on('irl', (data) => {
      socket.broadcast.emit('new_irl', data);
  });

});
