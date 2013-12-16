describe("App.Models.UserStory", function () {
    it("has default values", function () {
        // Create empty note model.
        var model = new App.Models.UserStory();

        expect(model).to.be.ok;
        expect(model.get("title")).to.equal("");
        expect(model.get("statement")).to.equal("As a _, I want _ so that _.");
        expect(model.get("storyPoints")).to.equal("?");
        expect(model.get("acceptanceCriteria")).to.be.an("Array");
        expect(model.get("acceptanceCriteria")).to.have.length(3);
        expect(model.get("createdDate")).to.be.a("Date");
    });

    it("sets passed attributes", function () {
        var model = new App.Models.UserStory({
            title: "Add user stories",
            statement: "As a LT user, I want to be able to add user stories to the system so that I can track user stories electronically.",
            acceptanceCriteria: ["needs to persist and look like a card","needs to have a statement, story points, and acceptance criteria."],
            storyPoints: "3"
        });

        expect(model.get("title")).to.equal("Add user stories");
        expect(model.get("statement")).to.equal("As a LT user, I want to be able to add user stories to the system so that I can track user stories electronically.");
        expect(model.get("acceptanceCriteria")).to.have.contain("needs to persist and look like a card");
        expect(model.get("acceptanceCriteria")).to.have.length(2);
        expect(model.get("storyPoints")).to.equal("3");
        expect(model.get("createdDate")).to.be.a("Date");
    });
});
