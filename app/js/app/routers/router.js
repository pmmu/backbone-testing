(function () {
    'use strict';

    // Router
    // ------
    // The router translates routes in to views.
    App.Routers.Router = Backbone.Router.extend({

        // **Note**: Could wrap this up in functions to allow easier
        // stubbing of the underlying methods. But, there are some
        // definite Backbone.js efficiencies from using simple string
        // method names instead (like name inference, etc).
        routes: {
            "": "userstories",
            "userstory/:id/:action": "userstory"
        },

        initialize: function (opts) {
            opts || (opts = {});
            this.userstoriesView = opts.userstoriesView || app.userstoriesView;
            this.userstoryNavView = opts.userstoryNavView || app.userstoryNavView;

            // Validation.
            if (!this.userstoriesView) { throw new Error("No userstoriesView"); }
            if (!this.userstoryNavView) { throw new Error("No userstoryNavView"); }

            // Stash current userstory view for re-rendering.
            this.userstoryView = null;
        },

        // Show userstories list.
        userstories: function () {
            this.userstoriesView.render();
        },

        // Common single userstory edit/view.
        userstory: function (userstoryId, action) {
            // Check if we are already at currently active view.
            if (this.userstoryView) {
                if (this.userstoryView.model.id === userstoryId) {
                    // Reuse existing userstory view if same userstory.
                    return this.userstoryView.trigger("update:" + action);
                } else {
                    // Else, remove the last stored view.
                    this.userstoryView.remove();
                }
            }

            // Try to find userstory in existing collection.
            var model = this.userstoriesView.collection.get(userstoryId);
            if (!model) {
                // Go to home page on missing model.
                return this.navigate("", { trigger: true });
            }

            // Create userstory and add to DOM.
            this.userstoryView = new App.Views.UserStory({ model: model }, {
                action: action,
                nav: this.userstoryNavView
            });
            $("#userstory").html(this.userstoryView.render().$el);
        }

    });
}());
