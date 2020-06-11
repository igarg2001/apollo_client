import React, { Fragment } from 'react';
import { LAUNCH_TILE_DATA } from "./launches";
import { RouteComponentProps } from '@reach/router';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Loading, Header, LaunchDetail } from '../components';
import { ActionButton } from '../containers';

interface LaunchProps extends RouteComponentProps {
}

export const GET_LAUNCH_DETAILS = gql`

query LaunchDetails($launchId: ID!) {
  launch(id: $launchId) {
    ...LaunchTile
    isInCart @client
    site
    rocket{
      name
      type
    }
  }
}
${LAUNCH_TILE_DATA}
`

const Launch: React.FC<LaunchProps> = ({launchId} : any) => { 
  const {data, loading, error} = useQuery
  (GET_LAUNCH_DETAILS, {
    variables : {launchId}
  })

  if(loading ) return <Loading />
if(error) return <p>Error : {error.message}</p>
if(!data) return <p>NOT FOUND</p>

console.log(data)
return (
  <Fragment>
    <Header image = {data.launch && data.launch.mission && data.launch.mission.missionPatch}>
  {data && data.launch && data.launch.mission && data.launch.mission.name}
    </Header>
  <LaunchDetail {...data.launch} />
  <ActionButton {...data.launch} />
  </Fragment>
)
}

export default Launch;
