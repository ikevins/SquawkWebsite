const Yelp = require('yelp-fusion');
const apiKey = process.env.YELP_FUSION_API_KEY;
const client = Yelp.client(apiKey);

const asyncHandler = require('express-async-handler');

const fusionSearch = asyncHandler((req, res) => {
  const location = req.query.location;
  const limit = req.query.limit;
  const offset = req.query.offset;
  const term = req.query.term;
  const sort_by = req.query.sort_by;
  const attributes = req.query.attributes;
  const open_at = req.query.open_at;
  const open_now = req.query.open_now;
  const price = req.query.price;
  const radius = req.query.radius;
  const longitude = req.query.longitude;
  const latitude = req.query.latitude;
  
  client.search({
      location: location,
      offset: offset,
      limit: limit,
      term: term,
      // sort_by: sort_by,
      attributes: attributes,
      open_at: open_at,
      open_now: open_now,
      // price: price,
      radius: radius,
      longitude: longitude,
      latitude: latitude


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