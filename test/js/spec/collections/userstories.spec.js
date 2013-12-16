describe("App.Collections.UserStories", function () {

    beforeEach(function () {
        // Sinon fake server for backend requests.
        this.server = sinon.fakeServer.create();

        // Server automatically responds to XHR requests.
        // Without this, tests *must* insert `this.server.respond()`
        // calls manually to force responses.
        this.server.autoRespond = true;

        // Create a reference for all internal suites/specs.
        this.userstories = new App.Collections.UserStories();
    });

    afterEach(function () {
        // Stop fake server.
        this.server.restore();
    });

    describe("retrieval", function () {

        // -- Omitted in Book. --
        it("has default values", function () {
            expect(this.userstories).to.be.ok;
            expect(this.userstories).to.have.length(0);
        });

        // -- Omitted in Book. --
        it("should be empty on fetch", function (done) {
            // Stash reference to save context.
            var userstories = this.userstories;

            // Return no models on GET.
            this.server.respondWith("GET", "/api/userstories", [
                200,
                { "Content-Type": "application/json" },
                "[]"
            ]);

            // Before fetch.
            expect(userstories).to.be.ok;
            expect(userstories).to.have.length(0);

            // After fetch.
            userstories.once("reset", function () {
                expect(userstories).to.have.length(0);
                done();
            });

            userstories.fetch({ reset: true });
        });

        it("has a single userstory", function (done) {
            var userstories = this.userstories, userstory;

            // Return a single model on GET.
            this.server.respondWith("GET", "/api/userstories", [
                200,
                { "Content-Type": "application/json" },
                JSON.stringify([{
                    id: 1,
                    title: "Test User Story #1",
                    statement: "As a test, I want a test so that I can test."
                }])
            ]);

            // After fetch.
            userstories.once("reset", function () {
                expect(userstories).to.have.length(1);

                // Check model attributes.
                userstory = userstories.at(0);
                expect(userstory).to.be.ok;
                expect(userstory.get("title")).to.contain("#1");
                expect(userstory.get("statement")).to.contain("As a test");

                done();
            });

            userstories.fetch({ reset: true });
        });

    });

    // -- Omitted in Book. --
    describe("modification", function () {

        beforeEach(function () {
            // Some pre-existing userstories.
            this.userstory1 = new App.Models.UserStory({
                id: 1,
                title: "Test User Story #1",
                statement: "As a test, I want a test so that I can test."
            });
            this.userstory2 = new App.Models.UserStory({
                id: 2,
                title: "Test User Story #2",
                text: "A new userstory, created in the test."
            });

            // Simulate the starting point for the collection.
            this.userstories.add(this.userstory1);
        });

        it("can delete a userstory", function (done) {
            var userstories = this.userstories, userstory;

            // After shift.
            userstories.once("remove", function () {
                expect(userstories).to.have.length(0);
                done();
            });

            // Remove and return first model.
            userstory = userstories.shift();
            expect(userstory).to.be.ok;
        });

        it("can create a second userstory", function (done) {
            var userstories = this.userstories,
                userstory = userstories.create(this.userstory2);

            // GET returns 2 models.
            this.server.respondWith("GET", "/api/userstories", [
                200,
                { "Content-Type": "application/json" },
                JSON.stringify([this.userstory1, this.userstory2])
            ]);

            // After fetch.
            userstories.once("reset", function () {
                expect(userstories).to.have.length(2);

                // Check model attributes.
                userstory = userstories.at(1);
                expect(userstory).to.be.ok;
                expect(userstory.get("title")).to.contain("#2");
                expect(userstory.get("text")).to.contain("new userstory");

                done();
            });

            userstories.fetch({ reset: true });
        });

    });
});
