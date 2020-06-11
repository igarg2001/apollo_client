import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import React from "react";
import ReactDOM from "react-dom";
import Pages from "./pages";
import injectStyles from "./styles";
import gql from 'graphql-tag'
import { typeDefs, resolvers } from "./resolvers";
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import Login from './pages/login';

// const MY_QUERY = gql`

//     query sampleLaunch {
//         launch (id : 43) {
//             id
//         isBooked
//         mission {
//             name
//             missionPatch
//         }
//         rocket {
//             id
//             name
//             type
//         }
//         site
//         }
//     }

// `
console.log(localStorage)
const IS_LOGGED_IN = gql`
query isUserLoggedIn {
    isLoggedIn @client
}

`
function IsLoggedIn () {
    const {data} = useQuery(IS_LOGGED_IN)
    //console.log(data)
    return data.isLoggedIn ? <Pages /> : <Login />
}

const cache = new InMemoryCache()
const link = new HttpLink({
    headers : {authorization : localStorage.getItem('token')},
    uri : "http://localhost:4000",
})
const client = new ApolloClient({
    cache,
    link,
    typeDefs,
    resolvers
})
cache.writeData({
    data : {
        isLoggedIn : !!localStorage.getItem('token'),
        cartItems : [],
    }
})

// client.query({
//     query : MY_QUERY
// })
//     .then(result => console.log(result.data))

injectStyles()
//console.log('rendering')
ReactDOM.render(

    <ApolloProvider client = {client}>
        <IsLoggedIn />
    </ApolloProvider>, document.getElementById('root')
)
