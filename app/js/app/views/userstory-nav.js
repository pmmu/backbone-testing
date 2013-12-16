(function () {
    'use strict';

    // UserStory Navigation Bar View
    // ------------------------
    // Controls note nav bar and emits navigation events.
    //
    // Listens to: events that trigger menu DOM updates.
    // * `nav:update:view`
    // * `nav:update:edit`
    //
    // Emits: events on menu clicks.
    // * `nav:view`
    // * `nav:edit`
    // * `nav:delete`
    App.Views.UserStoryNav = Backbone.View.extend({

        el: "#userstory-nav",

        events: {
            "click .userstory-view":   "clickView",
            "click .userstory-edit":   "clickEdit",
            "click .userstory-delete": "clickDelete"
        },

        initialize: function () {
            // Defaults for nav.
            this.$("li").removeClass("active");

            // Update the navbar UI for view/edit (not delete).
            this.on({
                "nav:update:view": this.updateView,
                "nav:update:edit": this.updateEdit
            });
        },

        // Handlers for updating nav bar UI.
        updateView: function () {
            this.$("li").not(".userstory-view").removeClass("active");
            this.$(".userstory-view").addClass("active");
        },
        updateEdit: function () {
            this.$("li").not(".userstory-edit").removeClass("active");
            this.$(".userstory-edit").addClass("active");
        },

        // Handlers for emitting nav events.
        clickView: function () {
            this.trigger("nav:update:view nav:view");
            return false;
        },
        clickEdit: function () {
            this.trigger("nav:update:edit nav:edit");
            return false;
        },
        clickDelete: function () {
            this.trigger("nav:update:delete nav:delete");
            return false;
        }

    });
}());
