(function () {
    'use strict';

    var ENTER = 13;

    // UserStories View
    // ----------
    // Displays a list of userstories.
    //
    // Contains:
    // * App.Views.UserStoriesFilter: Helper view for query filter.
    // * App.Views.UserStoriesItem: Child view for single userstory listing.
    //
    App.Views.UserStories = Backbone.View.extend({

        el: "#userstories",

        events: {
            "click    #userstory-create": function () {
                this.createUserStory();
            },
            "keypress #userstory-new-input": function (ev) {
                this.enterUserStory(ev);
            }
        },

        initialize: function () {
            // Cache view and just show on re-render.
            this.$input = this.$("#userstory-new-input");

            // Add user stories when we get data.
            //
            // **Note**: This has to come **before** the filter view
            // instantiation which relies on `addU` creating a DOM
            // element first in its events. Brittle, but simpler for this
            // demonstration.
            //
            this.listenTo(this.collection, {
                "reset":     function ()  { this.displayUserStories(); },
                "userstories:add": function (m) { this.displayUserStory(m); }
            });

            // Create helper filter view.
            this.filterView = new App.Views.UserStoriesFilter({
                collection: this.collection
            });

            // Need the collection to be fetched to kick off adding userstories.
            // This is currently done in "app.js"
        },

        render: function () {
            // Show appropriate region.
            $(".region").not(".region-userstories").hide();
            $(".region-userstories").show();
            return this;
        },

        // Add single child userstory view to front of userstories list.
        displayUserStory: function (model) {
            var view = new App.Views.UserStoriesItem({ model: model });

            this.$("#userstories-list tr")
                .filter(":last")
                .after(view.render().$el);
        },

        // Clear and add all userstories to userstories list.
        displayUserStories: function () {
            // Clear existing child userstory items.
            this.$("#userstories-list tr.userstories-item").remove();

            // Add all userstories from collection, sorted old to new.
            this.collection.chain()
                .sortBy(function (m) { return m.get("createdAt"); })
                .each(this.displayUserStory, this);
        },

        // Create userstory on enter key.
        enterUserStory: function (ev) {
            if (ev.which === ENTER) {
                this.createUserStory();
            }
        },

        createUserStory: function () {
            // Get value, then reset userstory input.
            var input = this.$input.val().trim();
            this.$input.val("");

            if (input) {
                this.create(input);
            }
        },

        create: function (title) {
            var coll = this.collection;

            // Add new model to collection, and corresponding userstory
            // to DOM after model is saved.
            coll.create({ title: title }, {
                success: function (colData, modelData) {
                    // Trigger event on model retrieved from collection.
                    coll.trigger("userstories:add", coll.get(modelData.id));
                }
            });
        }

    });
}());
