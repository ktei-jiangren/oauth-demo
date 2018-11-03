const express = require("express");
const app = express();
const jwt = require("express-jwt");
const jwtAuthz = require("express-jwt-authz");
const jwksRsa = require("jwks-rsa");

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://ktei2008.au.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: "gRHTVHV6I0CuLBV8vB1XGII9JUq89LIR",
  issuer: `https://ktei2008.au.auth0.com/`,
  algorithms: ["RS256"]
});

// This route doesn't need authentication
app.get("/api/public", function(req, res) {
  res.json({
    message:
      "Hello from a public endpoint! You don't need to be authenticated to see this."
  });
});

// This route need authentication
app.get("/api/private", checkJwt, function(req, res) {
  res.json({
    message:
      "Hello from a private endpoint! You need to be authenticated to see this."
  });
});

const PORT = 8000;
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
