describe("App.Routers.Router", function () {

    // Default option: Trigger and replace history.
    var opts = { trigger: true, replace: true };

    // Routing tests are a bit complicated in that the actual hash
    // fragment can change unless fully mocked out. We *do not* mock
    // the URL mutations meaning that a hash fragment will appear in
    // our test run (making the test driver appear to be a single
    // page app).
    //
    // There are alternative approaches to this, such as Backbone.js'
    // own unit tests which fully fake out the URL browser location
    // with a mocked object to instead contain URL information and
    // behave mostly like a real location.
    before(function () {
        // Dependencies and fake patches.
        this.sandbox = sinon.sandbox.create();

        // Mock the entire `UserStories` object.
        this.sandbox.mock(App.Views.UserStories);

        // Stub `UserStory` prototype and configure `render`.
        this.sandbox.stub(App.Views.UserStory.prototype);
        App.Views.UserStory.prototype.render.returns({ $el: null });
    });

    beforeEach(function () {
        // Fake function: Get a model simulation if id is "1".
        var get1 = function (i) {
            return i === "1" ? { id: "1" } : null;
        };

        // Create router with stubs and manual fakes.
        this.router = new App.Routers.Router({
            userstoriesView: {
                render: this.sandbox.stub(),
                collection: { get: get1 }
            },
            userstoryNavView: this.sandbox.stub()
        });

        // Start history to enable routes to fire.
        Backbone.history.start();

        // Spy on all route events.
        this.routerSpy = sinon.spy();
        this.router.on("route", this.routerSpy);
    });

    afterEach(function () {
        // Navigate to home page and stop history.
        this.router.navigate("", opts);
        Backbone.history.stop();
    });

    after(function () {
        this.sandbox.restore();
    });

    describe("routing", function () {

        before(function () {
            // Stub out userstories and userstory to check routing.
            //
            // Happens **before** the router instantiation.
            // If we stub *after* instantiation, then `userstories` and `userstory`
            // can no longer be stubbed in the usual manner.
            sinon.stub(App.Routers.Router.prototype, "userstories");
            sinon.stub(App.Routers.Router.prototype, "userstory");
        });

        beforeEach(function () {
            // Reset before every run.
            App.Routers.Router.prototype.userstories.reset();
            App.Routers.Router.prototype.userstory.reset();
        });

        after(function () {
            App.Routers.Router.prototype.userstories.restore();
            App.Routers.Router.prototype.userstory.restore();
        });

        it("can route to userstories", function () {
            // Start out at other route and navigate home.
            this.router.navigate("userstory/1/edit", opts);
            this.router.navigate("", opts);
            expect(App.Routers.Router.prototype.userstories)
                .to.have.been.calledOnce.and
                .to.have.been.calledWithExactly();
        });

        it("can route to userstory", function () {
            this.router.navigate("userstory/1/edit", opts);
            expect(App.Routers.Router.prototype.userstory)
                .to.have.been.calledOnce.and
                .to.have.been.calledWithExactly("1", "edit");
        });

    });

    describe("userstories", function () {

        it("can navigate to userstories page", function () {
            // Start out at other route and navigate home.
            this.router.navigate("userstory/1/edit", opts);
            this.router.navigate("", opts);

            // Spy has now been called **twice**.
            expect(this.routerSpy)
                .to.have.been.calledTwice.and
                .to.have.been.calledWith("userstories");
        });

    });

    describe("userstory", function () {

        it("can navigate to userstory page", sinon.test(function () {
            this.router.navigate("userstory/1/edit", opts);

            expect(this.routerSpy)
                .to.have.been.calledOnce.and
                .to.have.been.calledWith("userstory", ["1", "edit"]);
        }));

        it("can navigate to same userstory", sinon.test(function () {
            // Short router: Skip test if empty router.
            if (!this.router.userstoryView) { return; }

            this.router.navigate("userstory/1/edit", opts);
            expect(this.routerSpy)
                .to.have.been.calledOnce.and
                .to.have.been.calledWith("userstory", ["1", "edit"]);

            // Manually patch in model property (b/c stubbed).
            this.router.userstoryView.model = { id: "1" };

            // Navigating to same with different action works.
            this.router.navigate("userstory/1/view", opts);
            expect(this.routerSpy)
                .to.have.been.calledTwice.and
                .to.have.been.calledWith("userstory", ["1", "view"]);

            // Even with error, should still `remove` existing.
            this.router.navigate("userstory/2/view", opts);
            expect(this.router.userstoryView.remove)
                .to.have.been.calledOnce;
        }));

        it("navigates to list on no model", sinon.test(function () {
            // Short router: Skip test if empty router.
            if (!this.router.userstoryView) { return; }

            this.router.navigate("userstory/2/edit", opts);

            // Note that the route events are out of order because
            // the re-navigation to "userstories" happens **first**.
            expect(this.routerSpy)
                .to.have.been.calledTwice.and
                .to.have.been.calledWith("userstory", ["2", "edit"]).and
                .to.have.been.calledWith("userstories");
        }));

    });

});
