const { RESTDataSource } = require('apollo-datasource-rest')

class LaunchAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://api.spacexdata.com/v2/'
    }
    launchReducer(launch) {
        return {
          id: launch.flight_number || 0,
          cursor: `${launch.launch_date_unix}`,
          site: launch.launch_site && launch.launch_site.site_name,
          mission: {
            name: launch.mission_name,
            missionPatchSmall: launch.links.mission_patch_small,
            missionPatchLarge: launch.links.mission_patch,
          },
          rocket: {
            id: launch.rocket.rocket_id,
            name: launch.rocket.rocket_name,
            type: launch.rocket.rocket_type,
          },
        };
      }

    getAllLaunches = async () => {
        const response = await this.get('launches');
        //console.log(response)
        return Array.isArray(response) ? response.map(launch => this.launchReducer(launch)) : []
    }
    getLaunchByID = async ({launchID}) => {
        const response = await this.get('launches', {flight_number : launchID})
        return this.launchReducer(response[0])
    }

    getLaunchesByIDs = (launchIDs) => {
       // console.log(launchIDs)
        return Promise.all(launchIDs.map(launchID => this.getLaunchByID({launchID})))
    }
}
module.exports = LaunchAPI