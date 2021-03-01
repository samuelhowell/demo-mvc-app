import React, { useState, Component } from 'react';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

import './App.css';

const AppDetails = ({ children }) => {
  const [show, toggleShow] = useState(false);

  return (
    <>
      {!show && <Button onClick={() => toggleShow(true)}>Show App Details</Button>}
      <Toast show={show} onClose={() => toggleShow(false)}>
        <Toast.Header>
          <strong className="mr-auto">Loan App Details</strong>
        </Toast.Header>
        <Toast.Body>{children}</Toast.Body>
      </Toast>
    </>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: localStorage.getItem('status') || '',
      loanid: localStorage.getItem('loanid') || '',
      email: '',
      name: '',
      ssn: '',
      amount: '',
      submitted: localStorage.getItem('submitted') || false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      email: event.target.id === 'email' ? event.target.value : this.state.email,
      name: event.target.id === 'name' ? event.target.value : this.state.name,
      ssn: event.target.id === 'ssn' ? event.target.value : this.state.ssn,
      amount: event.target.id === 'amount' ? event.target.value : this.state.amount,
    });
  }


  getStatus(id) {

    if (localStorage.getItem('loanid')) {
      fetch(`/status/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(res => {
          console.log(res);
          if (res.success) {
            console.log(res.status);
            localStorage.setItem('status', res.status);
            this.setState({ status: res.status });
          }

        });

      if (localStorage.getItem('status') === 'pending') {
        setTimeout(() => { this.getStatus(localStorage.getItem('loanid')) }, 5000);
      }
    }
  }


  async handleSubmit(event) {

    this.setState({ submitted: true });
    localStorage.setItem('submitted', true);

    event.preventDefault();
    console.log({
      "name": this.state.name,
      "email": this.state.email,
      "ssn": this.state.ssn,
      "amount": this.state.amount
    });

    try {
      const response = await fetch('/apply/', {
        method: 'POST',
        body: JSON.stringify({
          "name": this.state.name,
          "email": this.state.email,
          "ssn": this.state.ssn,
          "amount": this.state.amount
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const res = await response.json();
        localStorage.setItem('loanid', res.loanid);
        this.setState({ loanid: res.loadid }, this.getStatus(res.loanid));
        return;
      }
      throw new Error('Request failed!');
    }
    catch (error) {
      console.log(error);
    }
  }

  componentWillMount() {
    this.getStatus(this.state.loanid);
  }

  render() {
    return (
      <Container className="p-3">
        <Jumbotron>
          <h1 className="header">Krab's Instant Loans</h1>
          <AppDetails>
            <ListGroup>
              <ListGroup.Item>React</ListGroup.Item>
              <ListGroup.Item>React Bootstrap</ListGroup.Item>
              <ListGroup.Item>Express backend for API controller</ListGroup.Item>
            </ListGroup>
          </AppDetails>
          <Card>
            <Card.Img variant="top" src="crabs.jpg" />
            <Card.Body>
              {this.state.submitted &&
                <>
                  <h2>Loan Status: {['pending', ''].includes(this.state.status) && <Spinner animation="border" variant="success" />}</h2>
                  <Alert variant="success"><Alert.Heading>{this.state.status}</Alert.Heading></Alert>
                </>
              }
              {!this.state.submitted && <Form onSubmit={this.handleSubmit}>
                <Card.Title>Loan Application</Card.Title>
                <Card.Text><em>Fill out using dummy data</em></Card.Text>

                <Form.Group as={Row}>
                  <Form.Label column sm={2}>
                    Email
                    </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      required
                      id="email"
                      type="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                      placeholder="Email" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={2} > Name</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      required
                      id="name"
                      value={this.state.name}
                      onChange={this.handleChange}
                      type="text"
                      placeholder="First and Last"
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={2} > SSN</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      required
                      id="ssn"
                      value={this.state.ssn}
                      onChange={this.handleChange}
                      type="text"
                      minlength="9"
                      maxlength="9"
                      placeholder="333224444"

                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={2} > Loan Amount</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      required
                      id="amount"
                      value={this.state.amount}
                      onChange={this.handleChange}
                      type="text"
                      placeholder="1200"
                      minlength="4"
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Col sm={2}>
                    <Button type="submit">APPLY</Button>
                  </Col>
                </Form.Group>
              </Form>
              }
            </Card.Body>
          </Card>
        </Jumbotron>
      </Container>
      );
    }
}

export default App;
