(function () {
    'use strict';

    // User Stories Collection
    // ----------------
    App.Collections.UserStories = Backbone.Collection.extend({

        model: App.Models.UserStory,

        url: "/api/userstories"

    });
}());
