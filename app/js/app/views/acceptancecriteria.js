(function () {
    'use strict';

    // User Story View Pane
    // --------------
    // Render a single user story pane for viewing.
    App.Views.AcceptanceCriteria = Backbone.View.extend({

        template: _.template(App.Templates["template-acceptancecriteria-view"]),

        converter: new Showdown.converter(),

        initialize: function () {
        },

        // Convert user story data into Markdown.
        render: function () {
            this.$el.html(this.template({
                acceptanceCriteria: this.converter.makeHtml(this.model.get("acceptanceCriteria").join("\n"))
            }));
            return this;
        }
    });
}());
