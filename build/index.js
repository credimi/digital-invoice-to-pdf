'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
var dotenv_1 = __importDefault(require('dotenv'))
var express_1 = __importDefault(require('express'))
dotenv_1.default.config()
// Create a new express application instance
var app = express_1.default()
app.get('/', function(req, res) {
  res.send('Hello ' + process.env.APP_ID + '!')
})
app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
})
