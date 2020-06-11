import React, { Fragment }  from 'react';
import { useQuery } from "@apollo/react-hooks";
import { RouteComponentProps } from '@reach/router';
import gql from 'graphql-tag';
import { Loading, Header, LaunchTile, Button } from '../components';

interface LaunchesProps extends RouteComponentProps {

}

export const LAUNCH_TILE_DATA = gql`

fragment LaunchTile on Launch {
  id
  isBooked
  mission {
    name
    missionPatch
  }
  rocket {
    name
    type
  }
}

`

const GET_LAUNCHES = gql`
  query launchList($after: String) {
    launches(pageSize: 5 , after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
        site
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

const Launches : React.FC<LaunchesProps> =  () => {
  const { data, loading, error, fetchMore } = useQuery(GET_LAUNCHES)
  if(loading) return <Loading />
  if(error) return <p>Error : {error.message}</p>
  if(!data) return <p>NOT FOUND ! </p>
  //console.log(data)
  return (
    <Fragment>
      <Header>
        {data.launches && data.launches.launches
          && data.launches.launches.map((launch : any) => {
              //console.log(launch)
              return <LaunchTile key= {launch.id} launch = {launch} />
          })
        }
      </Header>
      {data.launches && data.launches.hasMore
          && <Button onClick = {() => 
          
            fetchMore({
              variables : {
                after : data.launches.cursor
              },
              updateQuery : (prev, {fetchMoreResult, ...rest}) => {
                //console.log(rest)
                if(!fetchMoreResult) return prev;
                return {
                  ...fetchMoreResult,
                  launches : {
                    ...fetchMoreResult.launches,
                    launches : [
                      ...prev.launches.launches,
                      ...fetchMoreResult.launches.launches,
                    ]
                  }
                }
              }
            })}>Load More</Button>}
    </Fragment>
  )
} 


export default Launches;
