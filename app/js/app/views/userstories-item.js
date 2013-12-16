(function () {
    'use strict';

    // UserStories Item View
    // ---------------
    // A single userstory within a list of userstories.
    App.Views.UserStoriesItem = Backbone.View.extend({

        // Set rendered DOM element `id` property to the model's id.
        id: function () { return this.model.id; },

        tagName: "tr",

        className: "userstories-item",

        template: _.template(App.Templates["template-userstories-item"]),

        events: {
            "click .userstory-view":   function () { this.viewUserStory(); },
            "click .userstory-edit":   function () { this.editUserStory(); },
            "click .userstory-delete": function () { this.deleteUserStory(); }
        },

        initialize: function (attrs, opts) {
            // Get router from options or app. Also allow to be empty
            // so that tests can `render` without.
            opts || (opts = {});
            this.router = opts.router || app.router;

            this.listenTo(this.model, {
                "change":   function () { this.render(); },
                "destroy":  function () { this.remove(); }
            });
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        viewUserStory: function () {
            var loc = ["userstory", this.model.id, "view"].join("/");
            this.router.navigate(loc, { trigger: true });
        },

        editUserStory: function () {
            var loc = ["userstory", this.model.id, "edit"].join("/");
            this.router.navigate(loc, { trigger: true });
        },

        deleteUserStory: function () {
            // Destroying model triggers view cleanup.
            this.model.destroy();
        }

    });
}());
