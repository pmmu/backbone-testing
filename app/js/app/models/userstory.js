(function () {
    'use strict';

    // User Story Model
    // ----------
    App.Models.UserStory = Backbone.Model.extend({

        defaults: function () {
            return {
                title: "",
                statement: "As a _, I want _ so that _.",
                acceptanceCriteria: ["Acceptance Criteria #1","Acceptance Criteria #2","Acceptance Criteria #3"],
                storyPoints: "?",
                createdDate: new Date()
            };
        }

    });
}());
