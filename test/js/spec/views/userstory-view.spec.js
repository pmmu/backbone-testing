describe("App.Views.UserStoryView", function () {

    before(function () {
        // Create test fixture.
        this.$fixture = $("<div id='userstory-view-fixture'></div>");
    });

    beforeEach(function () {
        // Empty out and rebind the fixture for each run.
        this.$fixture.empty().appendTo($("#fixtures"));

        // New default model and view for each test.
        //
        // Creation actually calls `render()`, so in tests we have an
        // *already rendered* view.
        this.view = new App.Views.UserStoryView({
            el: this.$fixture,
            model: new App.Models.UserStory()
        });
    });

    afterEach(function () {
        // Destroying the model also destroys the view.
        this.view.model.destroy();
    });

    after(function () {
        // Remove all sub-fixtures after test suite finishes.
        $("#fixtures").empty();
    });

    it("can render an empty user story", function () {
        var $title = $("#pane-title"),
            $statement = $("#pane-statement"),
            $storyPoints = $("#pane-storypoints"),
            $acceptanceCriteria = $("#pane-acceptancecriteria");

        // Default to empty title.
        expect($title.text()).to.equal("");

        // Have simple default message.
        expect($statement.text()).to.equal("As a _, I want _ so that _.");
        expect($statement.html()).to.equal("<p>As a _, I want _ so that _.</p>");

        // Story points should be a ?
        expect($storyPoints.text()).to.equal("?");

        // acceptance criteria should have no default message
        expect($acceptanceCriteria.html()).to.contain("Acceptance Criteria");
    });

    it("can render more complicated markdown", function (done) {
        this.view.model.once("change", function () {
            var $title = $("#pane-title"),
                $statement = $("#pane-statement"),
                $storyPoints = $("#pane-storypoints"),
                $acceptanceCriteria = $("#pane-acceptancecriteria");

            // Our new (changed) fields.
            expect($title.text()).to.equal("My Title");
            expect($statement.html()).to.contain("As a new user story");
            expect($storyPoints.html()).to.contain("1");
            expect($acceptanceCriteria.html()).to.contain("should change the user story");

            done();
        });

        // Make our note a little more complex.
        this.view.model.set({
            title: "My Title",
            statement: "As a new user story, I want to display a title so that I know what I am.",
            storyPoints: "1",
            acceptanceCriteria: ["should change the user story","should display a title"]
        });
    });
});
