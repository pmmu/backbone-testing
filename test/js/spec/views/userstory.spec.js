// The following is needed for Mocha < 1.9.0 when using PhantomJS:
//
//  /*global confirm, mocha */
//  mocha.globals(["confirm"]);
//

describe("App.Views.UserStory", function () {

    before(function () {
        // Regions for different views.
        $("#fixtures").append($(
            "<div class='region-userstory' style='display: none;'></div>" +
                "<div class='region-userstories' style='display: none;'></div>"
        ));

        // App.Views.UserStory fixture.
        this.$fixture = $(
            "<div id='userstory-fixture'>" +
                "<div id='#userstory-pane-view-content'></div>" +
                "</div>"
        );

        // Any model changes will trigger a `model.save()`, which
        // won't work in the tests, so we have to fake the method.
        //
        // Stub the model prototype *once* for all our tests.
        sinon.stub(App.Models.UserStory.prototype, "save");
    });

    beforeEach(function () {
        this.routerSpy = sinon.spy();
        this.$fixture.appendTo($("#fixtures"));

        // Creation calls `render()`, so in tests we have an
        // *already rendered* view.
        this.view = new App.Views.UserStory({
            el: this.$fixture,
            model: new App.Models.UserStory()
        }, {
            // Pass an empty view and manually mock router.
            // We are essentially "faux" mocking the components.
            nav: new Backbone.View(),
            router: {
                navigate: this.routerSpy
            }
        });
    });

    afterEach(function () {
        this.$fixture.empty();
        if (this.view) { this.view.model.destroy(); }
    });

    after(function () {
        $("#fixtures").empty();
        App.Models.UserStory.prototype.save.restore();
    });

    describe("view modes and actions", function () {
        // `UserStoryView` first goes to `#userstory/:id/view`
        it("navigates / displays 'view' by default", function () {
            expect(this.routerSpy).to.be.calledWithMatch(/view$/);

            expect($("#userstory-pane-view")
                .css("display")).to.not.equal("none");
            expect($("#userstory-pane-edit")
                .css("display")).to.equal("none");
        });

        // Edit event triggers navigation to `#userstory/:id/edit`
        it("navigates / displays 'edit' on event", function () {
            this.view.trigger("update:edit");
            expect(this.routerSpy).to.be.calledWithMatch(/edit$/);

            expect($("#userstory-pane-edit")
                .css("display")).to.not.equal("none");
            expect($("#userstory-pane-view")
                .css("display")).to.equal("none");
        });

        it("confirms user story on delete", sinon.test(function () {
            this.stub(window, "confirm").returns(false);
            this.view.deleteUserStory();
            expect(window.confirm)
                .to.have.been.calledOnce.and
                .to.have.been.calledWith("Delete user story?");
        }));
    });

    describe("model interaction", function () {
        afterEach(function () {
            // Wipe out to prevent any further use.
            this.view = null;
        });

        it("is removed on destroyed model", sinon.test(function () {
            this.spy(this.view, "remove");
            this.spy(this.view.userstoryView, "remove");

            this.view.model.trigger("destroy");

            expect(this.view.remove).to.be.calledOnce;
            expect(this.view.userstoryView.remove).to.be.calledOnce;
        }));
    });

    describe("userstory rendering", function () {

        it("can render a userstory", function () {
            expect($(".region-userstory")
                .css("display")).to.not.equal("none");
            expect($(".region-userstories")
                .css("display")).to.equal("none");
        });

        it("can render a default userstory view", function () {
            var $title = $("#pane-title"),
                $statement = $("#pane-statement"),
                $storyPoints = $("#pane-storypoints"),
                $acceptanceCriteria = $("#acceptancecriteria-list tbody");

            // Default to empty title.
            expect($title.text()).to.equal("");

            // Have simple default message.
            expect($statement.text()).to.equal("As a _, I want _ so that _.");
            expect($statement.html()).to.equal("<p>As a _, I want _ so that _.</p>");

            // Story points should be a ?
            expect($storyPoints.text()).to.equal("?");

            // acceptance criteria should have no default message
            expect($acceptanceCriteria.children("tr").length).to.equal(4);
        });

        it("calls render on model events", sinon.test(function () {
            // Spy on `render` and check call/return value.
            this.spy(this.view, "render");

            this.view.model.trigger("change");

            expect(this.view.render)
                .to.be.calledOnce.and
                .to.have.returned(this.view);
        }));

        it("calls render on changed data", sinon.test(function () {
            this.spy(this.view, "render");

            // Replace form value and blur to force changes.
            $("#input-storypoints").val("1");
            $("#userstory-form-edit").blur();

            // `UserStory` view should have rendered.
            expect(this.view.render)
                .to.be.calledOnce.and
                .to.have.returned(this.view);

            // Check the `UserStoryView` view rendered the new markdown.
            expect($("#pane-storypoints").html())
                .to.match(/1/);
        }));
    });
});
