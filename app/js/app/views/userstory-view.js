(function () {
    'use strict';

    // User Story View Pane
    // --------------
    // Render a single user story pane for viewing.
    App.Views.UserStoryView = Backbone.View.extend({

        template: _.template(App.Templates["template-userstory-view"]),

        converter: new Showdown.converter(),

        initialize: function () {
            this.listenTo(this.model, "change", this.render);
            this.listenTo(this.model, "destroy", this.remove);
            this.render();
        },

        // Convert user story data into Markdown.
        render: function () {
            this.$el.html(this.template({
                title: this.model.get("title"),
                statement: this.converter.makeHtml(this.model.get("statement")),
                acceptanceCriteria: this.converter.makeHtml(this.model.get("acceptanceCriteria").join("\n")),
                storyPoints: this.converter.makeHtml(this.model.get("storyPoints"))
            }));
            return this;
        }
    });
}());
