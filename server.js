/**
 * Simple MongoDB-based backend notes server.
 */

var
  // Mongoose
  mongoose = require("mongoose"),
  MONGO_ADDR = process.env.MONGO_ADDR || "127.0.0.1",
  MONGO_PORT = parseInt(process.env.MONGO_PORT || 27017, 10),
  UserStory = {},

  // Express.
  express = require("express"),
  app = express(),
  ADDR = process.env.ADDR || "127.0.0.1",
  PORT = parseInt(process.env.PORT || 4322, 10);

// -----------------------
// UserStories Model
// -----------------------
UserStory.Schema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    "default": ""
  },
  statement: {
    type: String,
    trim: true,
    "default": "As a _, I want _ so that _."
  },
  storyPoints: {
    type: String,
    trim: true,
    "default": "?"
  },
  acceptanceCriteria: {
    type: Array,
    "default": []
  },
  createdAt: {
    type: Date,
    "default": new Date()
  }
}, {
  // Remove extra `id` attribute so we can make virtual.
  // See: https://github.com/LearnBoost/mongoose/issues/1137
  id: false,

  // Add virtual fields to data here.
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

UserStory.Schema.virtual("id").get(function () {
  return this.get("_id");
});

UserStory.Model = mongoose.model("UserStory", UserStory.Schema);

// -----------------------
// Application helpers
// -----------------------
// Generic results handler.
function _handler(res, status) {
  return function (err, results) {
    if (err) {
      return res.json({ err: err.toString() }, 500);
    }

    // Translate to JSON.
    if (Array.isArray(results)) {
      results = results.map(function (m) {
        return m.toJSON();
      });
    } else {
      results = results.toJSON();
    }

    res.set("cache-control", "no-cache");
    res.json(results, status || 200);
  };
}

// Log requests.
function _logRequest(req, res, next) {
  console.log([
    req.method,
    req.url,
    JSON.stringify(req.body)
  ].join(" "));

  return next();
}

// Redirects.
function _redirect(dest) {
  return function (req, res) {
    res.redirect(dest);
  };
}

// -----------------------
// Application server
// -----------------------
// Connect to MongoDB.
mongoose.connect("mongodb://" + MONGO_ADDR + ":" +
                 MONGO_PORT + "/test");

// Ignore favicon.
app.use(function (req, res, next) {
  if (req.url !== "/favicon.ico") { return next(); }
  res.set({"Content-Type": "image/x-icon"});
  res.send(200);
});

// Configurations and static server.
app.use(express.bodyParser());
app.enable("strict routing");

// Application.
app.all(/^(|\/|\/app)$/, _redirect("/app/"));
app.use("/app/", express.static(__dirname + "/app"));

// Tests.
app.all(/^\/test(|\/)$/, _redirect("/test/test.html"));
app.use("/test/", express.static(__dirname + "/test", {
  redirect : false
}));

app.use(_logRequest);

// REST API
// UserStories Collection
app.get("/api/userstories", function (req, res) {     // (R)ead
  UserStory.Model.find({}, _handler(res));
});

// UserStory Model
app.post("/api/userstories", function (req, res) {    // (C)reate
  UserStory.Model.create(req.body, _handler(res, 201));
});
app.put("/api/userstories/:id", function (req, res) { // (U)pdate
  UserStory.Model.findByIdAndUpdate(req.param("id"), { "$set": {
    title: req.body.title,
    text: req.body.text
  }}, _handler(res));
});
app.get("/api/userstories/:id", function (req, res) { // (R)ead
  UserStory.Model.findById(req.param("id"), _handler(res));
});
app.del("/api/userstories/:id", function (req, res) { // (D)elete
  UserStory.Model.findByIdAndRemove(req.param("id"), _handler(res));
});

// Run server.
app.listen(PORT, ADDR);
console.log("Server started up at http://" + ADDR + ":" + PORT);
