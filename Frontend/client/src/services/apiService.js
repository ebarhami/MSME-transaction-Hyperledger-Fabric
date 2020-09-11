import Api from '@/services/api'

export default {
  castBallot(electionId, voterId, picked) {
    return Api().post('castBallot', {       
      electionId: electionId,
      voterId: voterId,
      picked: picked
    })
  },
  queryAll() {
    return Api().get('queryAll')
  },
  queryByObjectType() {
    return Api().get('queryByObjectType')
  },
  queryWithQueryString(selected) {
    return Api().post('queryWithQueryString', {
      selected: selected
    }) 
  },
  register(username, firstName, lastName) {
    return Api().post('register', {
      username: username,
      first_name: firstName,
      last_name: lastName,
    }) 
  },
  login(username, identity) {
    return Api().post('login', {
      username: username,
      identity: identity 
    }) 
  },
  getProfile(username, identity) {
    return Api().post('get-profile', {
      username: username,
      identity: identity
    })
  },
  createAsset(username, identity, category, name, price) {
    return Api().post('create-asset', {
      username: username,
      identity: identity,
      category: category,
      name: name,
      price: price,
    })
  },
  myAsset(username, identity) {
    return Api().post('my-asset', {
      username: username,
      identity: identity
    })
  },
  issuedAsset(username, identity) {
    return Api().post('issued-asset', {
      username: username,
      identity: identity
    })
  },
  adminGetReport(username, identity, receiver) {
    return Api().post('admin-get-report', {
      username: username,
      identity: identity,
      receiver: receiver
    })
  },
  myReport(username, identity) {
    return Api().post('my-report', {
      username: username,
      identity: identity
    })
  },
  buy(username, identity, id) {
    return Api().post('buy', {
      username: username,
      identity: identity,
      id: id
    })
  },
  issueToken(username, identity, amount) {
    return Api().post('issue-token', {
      username: username,
      identity: identity,
      amount: amount
    })
  },
  sendToken(username, identity, amount, recipient) {
    return Api().post('send-token', {
      username: username,
      identity: identity,
      amount: amount,
      recipient: recipient
    })
  },
  queryByKey(key) {
    return Api().post('queryByKey', {
      key: key
    }) 
  },
  getCurrentStanding() {
    return Api().get('getCurrentStanding')
  }
}