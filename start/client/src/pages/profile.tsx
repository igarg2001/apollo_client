import React, { Fragment } from 'react';
import { RouteComponentProps } from '@reach/router';
import gql from "graphql-tag";
import { LAUNCH_TILE_DATA } from './launches';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { Loading, Header, LaunchTile, Button } from '../components';

interface ProfileProps extends RouteComponentProps {}

export const GET_MY_TRIPS = gql`

query GetMyTrips {
  me {
    id
    email
    trips {
      ...LaunchTile
    }
  }
}
${LAUNCH_TILE_DATA}
`


const Profile: React.FC<ProfileProps> = () => {
  const client = useApolloClient()
  const {data, loading, error} = useQuery(GET_MY_TRIPS,{
    fetchPolicy : 'network-only'
  })
  if(loading) return <Loading />
  if(error) return <p>Error : {error.message}</p>
  if(!data) return <p>NOT FOUND</p>

  //console.log(data)
  return (
    <Fragment>
      <Header>My Trips</Header>
      {data.me && data.me.trips.length ? (
        data.me.trips.map((launch : any) => (
          <LaunchTile key = {launch.id} launch = {launch} />
        ))) : (<p style = {{textAlign : 'center'}}>No Trips Booked :(</p>)
      }
      <Button onClick = { () => {
        client.writeData({data : {isLoggedIn : false}})
        localStorage.removeItem("token")
      }
      }>Log Out</Button>
    </Fragment>
  )
}

export default Profile;