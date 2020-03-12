const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Confetti = require('confetti')

const API_KEY =
  process.env.API_KEY || '2-8eaa3a790e8b08076a74ab0cb19473134f84493990b9550a'
const API_HOST = process.env.API_HOST || 'api.confetti.events'
const API_PROTOCOL = process.env.API_PROTOCOL || 'https'

const confetti = new Confetti({
  key: API_KEY,
  host: API_HOST,
  protocol: API_PROTOCOL
})

const app = express()
const server = require('http').Server(app)

const port = process.env.PORT || 3237

app.engine('.html', exphbs({ extname: '.html' }))
app.set('view engine', '.html')

app.use('/ace', express.static('node_modules/ace-builds/src-min'))
app.use('/public', express.static('views'))
app.use(bodyParser.json())

app.get('/', async (req, res) => {
  const eventRaw = await confetti.events.find(23756, { raw: true })
  const eventFormatted = await confetti.events.find(23756)
  return res.render('index', {
    rawJson: JSON.stringify(eventRaw, null, 2),
    yaysonJson: JSON.stringify(eventFormatted, null, 2)
  })
})

app.get('/example', async (req, res) => {
  const workspaces = await confetti.workspaces.findAll()
  const events = await confetti.events.findAll({ page: { size: 1 } })
  const eventsWithoutWorkspace = await confetti.events.findAll({
    filter: { hasWorkspace: false }
  })

  return res.render('example', {
    events: events,
    eventsWithoutWorkspace: eventsWithoutWorkspace,
    workspaces: workspaces,
    eventsResponseBody: JSON.stringify(events, null, 2),
    eventsWithoutWorkspaceResponseBody: JSON.stringify(
      eventsWithoutWorkspace,
      null,
      2
    ),
    workspacesResponseBody: JSON.stringify(workspaces, null, 2)
  })
})

app.get('/example/workspaces/:id', async (req, res) => {
  const workspace = await confetti.workspaces.find(req.params.id)
  const events = await confetti.events.findAll({
    filter: { workspaceId: req.params.id }
  })
  return res.render('workspace', {
    workspace: workspace,
    events: events,
    responseBody: JSON.stringify(workspace, null, 2),
    eventsResponseBody: JSON.stringify(events, null, 2)
  })
})

app.get('/example/events/:id', async (req, res) => {
  const event = await confetti.events.find(req.params.id)
  const tickets = await confetti.tickets.findAll({
    filter: { eventId: req.params.id }
  })
  return res.render('event', {
    event: event,
    tickets: tickets,
    eventResponseBody: JSON.stringify(event, null, 2),
    ticketsResponseBody: JSON.stringify(tickets, null, 2)
  })
})

app.get('/example/tickets/:id', async (req, res) => {
  const ticket = await confetti.tickets.find(req.params.id)
  return res.render('ticket', {
    ticket: ticket,
    responseBody: JSON.stringify(ticket, null, 2)
  })
})

server.listen(port, () => console.log('Listening on ' + port))
