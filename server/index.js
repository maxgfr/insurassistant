require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || '3000';
const AssistantV2 = require('ibm-watson/assistant/v2');
const assistant = new AssistantV2({
  version: '2019-02-28',
  username: process.env.ASSISTANT_USERNAME,
  password: process.env.ASSISTANT_PASSWORD,
  url: process.env.ASSISTANT_URL
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
const assistant_id = process.env.ASSISTANT_ID;

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
  res.json({status: 'avalaible'})
});

app.post('/', (req, res) => {
  res.json({status: 'avalaible'})
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

function createSession(assistant_id) {
  return new Promise((resolve, reject) => {
    try {
      conversation.createSession({ assistant_id: assistant_id }, (err, response) => {
          if (err) {
            console.log(err);
          } else{
            resolve(response);
          }
        });
    } catch(e) {
      reject(e);
    }
  });
}

function sendConversationMessage(assistant_id, session_id, msg, context) {
    return new Promise((resolve, reject) => {
      try {
        conversation.message(
          {
            assistant_id: assistant_id,
            session_id: session_id,
            context: context,
            input: {
              'message_type': 'text',
              'text': msg,
              'options': {
                'return_context': true
              }
            }
          },
          (err, response)  => {
            if (err) {
              reject(err);
            } else {
              resolve(response);
            }
          }
        );
      } catch(e) {
        reject(e);
      }
    });
}
