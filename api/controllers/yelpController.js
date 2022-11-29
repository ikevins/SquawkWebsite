const Yelp = require('yelp-fusion');
const apiKey = process.env.YELP_FUSION_API_KEY;
const client = Yelp.client(apiKey);

const asyncHandler = require('express-async-handler');

const fusionSearch = asyncHandler((req, res) => {
  const location = req.query.location;
  const limit = req.query.limit;
  const offset = req.query.offset;
  const term = req.query.term;
  
  client.search({
      location: location,
      offset: offset,
      limit: limit,
      term: term
  }).then(response => {
      //console.log(JSON.stringify(response.jsonBody));
      res.send(response.jsonBody.businesses);
  }).catch(e => {
      //console.log(e);
      res.status(400).send("Yelp fusion search error");
  });
});

const fusionGetBusinessDetails = asyncHandler((req, res) => {
  const businessID = req.query.businessID;
  
  client.business(businessID).then(response => {
      console.log(JSON.stringify(response.jsonBody));
      res.send(response.jsonBody);
  }).catch(e => {
      console.log(e);
      res.status(400).send("Yelp fusion info error");
  });
});

module.exports = {
  fusionSearch,
  fusionGetBusinessDetails,
};