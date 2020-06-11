const { paginateResults } = require('./utils')

module.exports = {
    Query : {
        launches: async (_, { pageSize = 20, after }, { dataSources }) => {
            const allLaunches = await dataSources.launchAPI.getAllLaunches();
            // we want these in reverse chronological order
            //allLaunches.reverse();
            const launches = paginateResults({
              after,
              pageSize,
              results: allLaunches
            });
            return {
              launches,
              cursor: launches.length ? launches[launches.length - 1].cursor : null,
              // if the cursor at the end of the paginated results is the same as the
              // last item in _all_ results, then there are no more results after this
              hasMore: launches.length
                ? launches[launches.length - 1].cursor !==
                  allLaunches[allLaunches.length - 1].cursor
                : false
            };
          },
        launch : (_, {id}, {dataSources}) => 
            dataSources.launchAPI.getLaunchByID({launchID : id}),
        me : (_,__, {dataSources}) => dataSources.userAPI.findOrCreateUser()
    },

    Mutation :  {
        login : async (_, {email}, {dataSources}) => {
            const user = await dataSources.userAPI.findOrCreateUser({email})
            if(user) return Buffer.from(email).toString('base64')
        },
        bookTrips : async (_, {launchIds}, {dataSources}) => {
           // console.log(launchIds)
            const results = await dataSources.userAPI.bookTrips({launchIds})
            const launches = await dataSources.launchAPI.getLaunchesByIDs(launchIds)
            return {
                success : results && results.length === launchIds.length,
                message : 
                        results.length === launchIds.length
                        ? 'trips booked successfuly!'
                        : `the following launches couldn't be booked : ${launchIds.filter(id => !results.include(id))}`,
                launches,
            }
        },
        cancelTrip : async (_, {launchID}, {dataSources}) => {
            const result = await dataSources.userAPI.cancelTrip({launchID})
            if(!result)
            return {
                success : false,
                message : 'failed to cancel trip!'
            }
            const launch = await dataSources.launchAPI.getLaunchByID({launchID})
            return {
                success : true,
                message : 'trip canceled',
                launches : [launch]
            }
        }
    },

    Mission : {
        missionPatch : (mission, { size } = {size : 'LARGE'}) => {
            return size==='SMALL' ? 
                mission.missionPatchSmall :
                mission.missionPatchLarge;
        }
    },
    Launch: {
        isBooked: async (launch, _, { dataSources }) =>
          dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id }),
      },
      User: {
        trips: async (_, __, { dataSources }) => {
          // get ids of launches by user
          const launchIds = await dataSources.userAPI.getLaunchIdsByUser();
          if (!launchIds.length) return [];
          // look up those launches by their ids
          return (
            dataSources.launchAPI.getLaunchesByIds({
              launchIds,
            }) || []
          );
        },
      },
}