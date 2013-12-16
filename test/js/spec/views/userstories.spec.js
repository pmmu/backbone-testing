describe("App.Views.UserStories", function () {

    before(function () {
        // Create nav fixture (needed) and test fixture.
        $("#fixtures").append($(
            "<form class=\"navbar-search\">" +
                "<input type=\"text\" class=\"search-query\">" +
                "</form>"
        ));
        this.$fixture = $(
            "<div id='userstories' class='region region-userstories'>" +
                "<table id='userstories-list'>" +
                "<tr><td>" +
                "<input id='userstory-new-input'>" +
                "<div id='userstory-create'></div>" +
                "</td></tr>" +
                "</table>" +
                "</div>"
        ).appendTo($("#fixtures"));

        // Create collection of userstories data that we will sometimes
        // use to check full rendering, etc.
        this.userstories = _.map(_.range(4), function (i) {
            return new App.Models.UserStory({
                id: i.toString(),
                title: "title" + i,
                statement: "statement" + i,
                storyPoints: "?",
                acceptanceCriteria: ["acceptanceCriteria" + i]
            });
        });

        this.collection = new App.Collections.UserStories();
        this.view = new App.Views.UserStories({
            collection: this.collection
        });

        this.collection.trigger("add:userstories");
    });

    beforeEach(function () {
        // Empty out the fixture.
        $("tr.userstories-item").remove();
    });

    after(function () {
        // Remove views and trigger model destroy to have any internal
        // `UserStoriesItem` views remove themselves.
        this.view.remove();
        _.each(this.userstories, function (m) { m.trigger("destroy"); });

        // Clean up DOM fixtures.
        $("#fixtures").empty();
    });

    describe("render", function () {

        it("shows userstories region on render", function () {
            // Hide the fixture region first.
            this.$fixture.hide();
            expect(this.$fixture.css("display")).to.equal("none");

            // Render and verify shown.
            this.view.render();
            expect(this.$fixture.css("display")).to.not.equal("none");
        });

    });

    // Tests `displayUserStories` and `displayUserStories`.
    describe("add existing userstories", function () {

        it("adds userstories on collection reset", sinon.test(function () {
            this.stub(this.view, "displayUserStories");

            this.collection.trigger("reset");

            expect(this.view.displayUserStories).to.be.calledOnce;
        }));

        it("does not add when empty", sinon.test(function () {
            this.spy(this.view, "displayUserStory");

            this.view.displayUserStories();

            expect(this.view.displayUserStory).to.not.be.called;
            expect($("tr.userstories-item")).to.have.length(0);
        }));

        // Replace collection `chain()` with our data, so that we can
        // simulate a collection full of models without having to
        // actually change model state.
        //
        // Spy `displayUserStory` here to check that it was called **and** be
        // able to verify that it rendered correctly in our fixture.
        it("adds with models", sinon.test(function () {
            this.spy(this.view, "displayUserStory");
            this.stub(this.collection, "chain", _.bind(function () {
                return _.chain(this.userstories);
            }, this));

            this.view.displayUserStories();

            expect(this.view.displayUserStory.callCount).to.equal(4);
            expect($("tr.userstories-item")).to.have.length(4);
        }));

    });

    describe("create new userstories", function () {

        // Trigger with "click".
        it("does not create when no title", sinon.test(function () {
            this.spy(this.view, "createUserStory");
            this.stub(this.view, "create");

            $("#userstory-create").trigger("click");

            expect(this.view.createUserStory).to.have.been.calledOnce;
            expect(this.view.create).to.not.have.been.called;
        }));

        // Make direct call on "enter" function.
        it("creates when title", sinon.test(function () {
            this.spy(this.view, "enterUserStory");
            this.spy(this.view, "createUserStory");
            this.stub(this.view, "create");

            // Simulate an "enter" (keycode 13) event on `enterUserStory` after
            // we have entered a title in the new userstory input field.
            //
            // See: http://stackoverflow.com/questions/6124692
            $("#userstory-new-input")
                .val("New Title")
                .trigger($.Event("keypress", { which: 13 }));

            expect(this.view.enterUserStory).to.have.been.calledOnce;
            expect(this.view.createUserStory).to.have.been.calledOnce;
            expect(this.view.create).to.have.been.called;
        }));

        // Check creation triggers add event and updates DOM.
        it("adds userstory to DOM on create", sinon.test(function () {
            var userstory = this.userstories[0],
                addSpy = this.spy();

            // Stub collection `create` to just call the success callback
            // with specified userstory and `get` that userstory as well.
            this.stub(this.collection, "create")
                .yieldsTo("success", null, userstory.toJSON());
            this.stub(this.collection, "get").returns(userstory);

            // Set up spies on events and actual addition.
            this.collection.on("userstories:add", addSpy);
            this.spy(this.view, "displayUserStory");

            this.view.create("My Title");

            // Check spies, stubs.
            expect(this.view.displayUserStory).to.have.been.calledOnce;
            expect(this.collection.create).to.have.been.calledOnce;
            expect(addSpy)
                .to.have.been.calledOnce.and
                .to.have.been.calledWith(userstory);

            // Check the userstory was added to the DOM.
            expect($("tr.userstories-item")).to.have.length(1);

            // Stop listeners on collection. We want to do this here
            // because we persist the collection object across tests in
            // this suite.
            this.collection.off("userstories:add", addSpy);
        }));

    });

});
