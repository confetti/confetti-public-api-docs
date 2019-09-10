const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const app = express()
const server = require('http').Server(app)

const api = require('./app/api')
const port = process.env.PORT || 3237

app.engine('.html', exphbs({ extname: '.html' }))
app.set('view engine', '.html')

app.use('/ace', express.static('node_modules/ace-builds/src-min'))
app.use('/public', express.static('views'))
app.use(bodyParser.json())

app.get('/', async (req, res) => {
  const event = await api.get('/events/23756')
  return res.render('index', {
    rawJson: JSON.stringify(event, null, 2),
    yaysonJson: JSON.stringify(api.format(event), null, 2)
  })
})

app.get('/example', async (req, res) => {
  const events = await api.get('/events')
  const eventsWithoutOrganisation = await api.get(
    '/events?filter[hasOrganisation]=false'
  )
  const organisations = await api.get('/organisations')

  return res.render('example', {
    events: api.format(events),
    eventsWithoutOrganisation: api.format(eventsWithoutOrganisation),
    organisations: api.format(organisations),
    eventsResponseBody: JSON.stringify(events, null, 2),
    eventsWithoutOrganisationResponseBody: JSON.stringify(
      eventsWithoutOrganisation,
      null,
      2
    ),
    organisationsResponseBody: JSON.stringify(organisations, null, 2)
  })
})

app.get('/example/organisations/:id', async (req, res) => {
  const organisation = await api.get('/organisations/' + req.params.id)
  const events = await api.get(
    '/events?filter[organisationId]=' + req.params.id
  )
  return res.render('organisation', {
    organisation: api.format(organisation),
    events: api.format(events),
    responseBody: JSON.stringify(organisation, null, 2),
    eventsResponseBody: JSON.stringify(events, null, 2)
  })
})

app.get('/example/events/:id', async (req, res) => {
  const event = await api.get('/events/' + req.params.id)
  const tickets = await api.get('/events/' + req.params.id + '/tickets')
  return res.render('event', {
    event: api.format(event),
    tickets: api.format(tickets),
    eventResponseBody: JSON.stringify(event, null, 2),
    ticketsResponseBody: JSON.stringify(tickets, null, 2)
  })
})

app.get('/example/tickets/:id', async (req, res) => {
  const ticket = await api.get('/tickets/' + req.params.id)
  return res.render('ticket', {
    ticket: api.format(ticket),
    responseBody: JSON.stringify(ticket, null, 2)
  })
})

server.listen(port)
