import React from 'react'
import { Container, Table, Grid, Image } from 'semantic-ui-react'
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom'

const Menu = () => {
  const menyStyle = {
    backgroundColor: '#C5C2EE',
    fontSize: '20',
    fontFamily: 'sans-serif',
    paddingTop: '0.5em',
    paddingBottom: '0.5em'
  }

  const menyActive = {
    backgroundColor: '#9B96E1',
    padding: '0.5em',
    marginTop: '0.5em',
    textDecoration: 'none'
  }

  const linkStyle = {
    color: 'white',
    padding: '0.5em',
    marginTop: '0.5em',
    textDecoration: 'none'
  }
  return (
    <div style={menyStyle}>
      <NavLink exact to="/" style={linkStyle} activeStyle={menyActive}>Anecdotes</NavLink>
      <NavLink exact to="/create" style={linkStyle} activeStyle={menyActive}>Create new</NavLink>
      <NavLink exact to="/about" style={linkStyle} activeStyle={menyActive}>About</NavLink>
    </div>
  )
}



const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <Table striped celled>
      <Table.Body>
        {anecdotes.map(anecdote =>
          <Table.Row key={anecdote.id}>
            <Table.Cell>
              <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  </div>
)

const Anecdote = ({ anecdote }) => {
  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <div>has {anecdote.votes} votes</div>
      <div>for more info see <a href={anecdote.info}>{anecdote.info}</a></div>
    </div>
  )
}

const About = () => (
  <Grid columns={2}>
    <Grid.Column key={1} width={10}>
      <div>
        <h2>About anecdote app</h2>
        <p>According to Wikipedia:</p>

        <em>An anecdote is a brief, revealing account of an individual person or an incident.
          Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
          such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

        <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
      </div>
    </Grid.Column>
    <Grid.Column key={2} width={6} floated={"right"}>
      <Image src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Commodore_Grace_M._Hopper%2C_USN_%28covered%29.jpg/384px-Commodore_Grace_M._Hopper%2C_USN_%28covered%29.jpg' />
    </Grid.Column>
  </Grid>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://courses.helsinki.fi/fi/TKT21009/121540749'>Full Stack -sovelluskehitys</a>.

    See <a href='https://github.com/mluukkai/routed-anecdotes'>https://github.com/mluukkai/routed-anecdotes</a> for the source code.
  </div>
)

const Notification = (props) => {
  const notificationStyle = {
    backgroundColor: '#97E285',
    color: 'white',
    fontFamily: 'sans-serif',
    padding: '0.5em',
    marginTop: '0.5em'
  }
  return (<div style={notificationStyle}>
    {props.message}
  </div>)
}

class CreateNew extends React.Component {
  constructor() {
    super()
    this.state = {
      content: '',
      author: '',
      info: ''
    }
  }

  handleChange = (e) => {
    console.log(e.target.name, e.target.value)
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.addNew({
      content: this.state.content,
      author: this.state.author,
      info: this.state.info,
      votes: 0
    })
    this.setState({
      content: '',
      author: '',
      info: ''
    })
    this.props.history.push('/')
  }

  render() {
    return (
      <div>
        <h2>create a new anecdote</h2>
        <form onSubmit={this.handleSubmit}>
          <div>
            content
            <input name='content' value={this.state.content} onChange={this.handleChange} />
          </div>
          <div>
            author
            <input name='author' value={this.state.author} onChange={this.handleChange} />
          </div>
          <div>
            url for more info
            <input name='info' value={this.state.info} onChange={this.handleChange} />
          </div>
          <button>create</button>
        </form>
      </div>
    )

  }
}

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      anecdotes: [
        {
          content: 'If it hurts, do it more often',
          author: 'Jez Humble',
          info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
          votes: 0,
          id: '1'
        },
        {
          content: 'Premature optimization is the root of all evil',
          author: 'Donald Knuth',
          info: 'http://wiki.c2.com/?PrematureOptimization',
          votes: 0,
          id: '2'
        }
      ],
      notification: ''
    }
  }

  addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0)
    this.setState({ anecdotes: this.state.anecdotes.concat(anecdote) })
    this.setState({
      notification: `a new anecdote '${anecdote.content}' created!`
    })
    setTimeout(() => {
      this.setState({
        notification: ''
      })
    }, 10000)
  }

  anecdoteById = (id) =>
    this.state.anecdotes.find(a => a.id === id)

  vote = (id) => {
    const anecdote = this.anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    const anecdotes = this.state.anecdotes.map(a => a.id === id ? voted : a)

    this.setState({ anecdotes })
  }

  render() {
    return (
      <Container>
        <div>
          <Router>
            <div>
              <h1>Software anecdotes</h1>
              <Menu />
              {this.state.notification !== '' && <Notification message={this.state.notification} />}
              <Route exact path="/" render={() => <AnecdoteList anecdotes={this.state.anecdotes} />} />
              <Route exact path="/create" render={({ history }) => <CreateNew history={history} addNew={this.addNew} />} />
              <Route exact path="/about" render={() => <About />} />
              <Route exact path="/anecdotes/:id" render={({ match }) =>
                <Anecdote anecdote={this.anecdoteById(match.params.id)} />}
              />
              <Footer />
            </div>
          </Router>
        </div>
      </Container>
    );
  }
}

export default App;
