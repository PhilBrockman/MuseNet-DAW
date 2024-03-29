import axios from 'axios';

class APIClient {
  constructor(accessToken) {
    this.BASE_URI = 'http://localhost:4433';
    this.accessToken = accessToken;
  }

  createGeneration(data) {
    console.log("creating ", data)
    const newGens =  this.perform('post', '/generation', data)
    console.log('newGens', newGens)
    return newGens;
  }

  deleteGeneration(id) {
    console.log(`deleting ${id} from api`)
    return this.perform('delete', `/generation/${id}`);
  }

  generations() {
    return this.perform('get', '/generations')
  }

  getGeneration(id) {
    return this.perform('get', `/generation/${id}`);
  }

  createMediaForGeneration(id) {
    return this.perform('get', `/generation/${id}/generate_midi`)
  }

  getTracks(id) {
    return this.perform('get', `/generation/${id}/tracks`)
  }

  getMediaForGeneration(item, overwrite) {
    return this.createMediaForGeneration(item)
    .then(() => this.perform('get', `/generation/${item["_id"]["$oid"]}/media`));
  }

  downloadMIDI(item){
    return this.getMediaForGeneration(item)
                  .then(res => {
                    console.log("res", res.data[0].midi_location)
                    window.location = `${this.BASE_URI}/midifiles/${res.data[0].midi_location}`
                  })

  }

  async perform (method, resource, data) {
    return await axios({
      method,
      baseURL: this.BASE_URI,
      url: resource,
      json:true,
      data: {
        ...data,
        token: this.accessToken
      }
    })
  }
}


const api = new APIClient("some token")

export default api;
