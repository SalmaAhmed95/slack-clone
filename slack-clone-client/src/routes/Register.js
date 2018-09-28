import React from 'react';
import {Input, Container, Header, Button, Checkbox, Form, Divider, Message} from 'semantic-ui-react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag';
class Register extends React.Component{
  state = {
    username: '',
    usernameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
  };
onChange = e => {
  const {name, value } = e.target;
  this.setState({[name] : value});
};
onSubmit = async () => {
  this.setState({
      usernameError: '',
      emailError: '',
      passwordError: '',
    });

  //const {username, email, password } = this.state;
  const response = await this.props.mutate({
    variables: this.state,
  });
  const {ok, errors} = response.data.register;
  if(ok) {
    this.props.history.push('/');
  } else {
    const err = {};
    errors.forEach(({ path, message }) => {
       err[`${path}Error`] = message;
     });
     this.setState(err);
  }

  console.log(response);
};
  render() {
    const {username, email, password, usernameError, emailError, passwordError} = this.state;
    const errorList = [];

    if (usernameError) {
      errorList.push(usernameError);
    }

    if (emailError) {
      errorList.push(emailError);
    }

    if (passwordError) {
      errorList.push(passwordError);
    }

    return (
      <Container text >
       <br></br>
        <Header as="h1" textAlign='center' color="blue"> Welcome to Slack-Clone</Header>
        <br></br>
        <Form size="big">
          <Form.Field>
            <label>User Name</label>
            <Input
              error={!!usernameError}
              name="username"
              onChange={this.onChange}
              value={username}
              placeholder="Username"
              fluid />
          </Form.Field>
          <Form.Field>
            <label>Email</label>
            <Input
              error={!!emailError}
              name="email"
              onChange={this.onChange}
              value={email}
              placeholder="Email"
              fluid />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <Input
            error={!!passwordError}
            name="password"
            onChange={this.onChange}
            value={password}
            type="password"
            placeholder="Password"
            fluid />
            </Form.Field>
            <Form.Field>
              <Checkbox label='I agree to the Terms and Conditions' />
              </Form.Field>
            <Button size="big" primary fluid basic color='blue' onClick={this.onSubmit}>Sign Up</Button>
            <Divider horizontal>Or</Divider>
            <Button size="big" secondary fluid basic color='black'>
               Log In
            </Button>
            {usernameError || emailError || passwordError ? (
              <Message error header="There was some errors with your submission" list={errorList} />
              ) : null}
         </Form>
      </Container>
    );
  }
}
const registerMutation = gql`
  mutation ($username: String!, $password: String!, $email: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
      path
      message
      }
    }
  }
`;
export default graphql(registerMutation)(Register);
