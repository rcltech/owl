import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import dotenv from 'dotenv';
dotenv.config();

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'https://phoenix.rctech.club/graphql',
  headers: {
    authorization: sessionStorage.getItem('token')
  }
});

const client = new ApolloClient({
  cache,
  link
});

cache.writeData({
  data: {
    isLoggedIn: !!sessionStorage.getItem('token')
  }
});

const Index = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<Index />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
