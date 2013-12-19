(function () {
    'use strict';

    // UserStory View
    // ---------
    // A single user story.
    //
    // Contains:
    // * App.Views.UserStoryNav: Helper view for navigation events.
    // * App.Views.UserStoryView: Child view for rendering Markdown.
    //
    App.Views.UserStory = Backbone.View.extend({

        id: "userstory-panes",

        template: _.template(App.Templates["template-userstory"]),

        events: {
            "blur   #userstory-form-edit": "saveUserStory",
            "submit #userstory-form-edit": function () { return false; }
        },

        initialize: function (attrs, opts) {
            // Default to empty options.
            opts || (opts = {});

            // Add member variables.
            //
            // Router can be set directly (e.g., tests), or use global.
            // The `app.router` object *does* exist at this point.
            this.nav = opts.nav;
            this.router = opts.router || app.router;

            // Verification.
            if (!this.router) { throw new Error("No router"); }

            // Add our custom listeners.
            this._addListeners();

            // Render HTML, update to action, and show note.
            this.$el.html(this.template(this.model.toJSON()));
            this.update(opts.action || "view");
            this.render();

            // Add in viewer child view (which auto-renders).
            this.userstoryView = new App.Views.UserStoryView({
                el: this.$("#userstory-pane-view-content"),
                model: this.model
            });
        },

        // Helper listener initialization method.
        _addListeners: function () {
            // Model controls view rendering and existence.
            this.listenTo(this.model, {
                "destroy": function () { this.remove(); },
                "change":  function () { this.render().model.save(); }
            });

            // Navbar controls/responds to panes.
            this.listenTo(this.nav, {
                "nav:view":   function () { this.viewUserStory(); },
                "nav:edit":   function () { this.editUserStory(); },
                "nav:delete": function () { this.deleteUserStory(); }
            });

            // Respond to update events from router.
            this.on({
                "update:view": function () { this.render().viewUserStory(); },
                "update:edit": function () { this.render().editUserStory(); }
            });
        },

        // Rendering the note is simply showing the active pane.
        // All HTML should already be rendered during initialize.
        render: function () {
            $(".region").not(".region-userstory").hide();
            $(".region-userstory").show();
            return this;
        },

        remove: function () {
            // Remove child, then self.
            this.userstoryView.remove();
            Backbone.View.prototype.remove.call(this);
        },

        // Update internal "action" state (view or edit).
        update: function (action) {
            action = action || this.action || "view";
            var paneEl = "#userstory-pane-" + action,
                loc = "userstory/" + this.model.id + "/" + action;

            // Ensure menu bar is updated.
            this.nav.trigger("nav:update:" + action);

            // Show active pane.
            this.$(".pane").not(paneEl).hide();
            this.$(paneEl).show();

            // Store new action and navigate.
            if (this.action !== action) {
                this.action = action;
                this.router.navigate(loc, { replace: true });
            }
        },

        // Activate "view" or "edit" note panes.
        viewUserStory: function () {
            this.update("view");
        },
        editUserStory: function () {
            this.update("edit");
        },

        // Delete model (causes view removal) and navigate to
        // "all userstories" list page.
        deleteUserStory: function () {
            if (confirm("Delete user story?")) {
                this.model.destroy();
                this.router.navigate("", { trigger: true, replace: true });
            }
        },

        // Save story (triggering model change).
        saveUserStory: function () {
            this.model.set({
                title: this.$("#input-title").val().trim(),
                statement: this.$("#input-statement").val().trim(),
                storyPoints: this.$("#input-storypoints").val().trim(),
                // acceptanceCriteria: [""]
            });
        }

    });
}());
