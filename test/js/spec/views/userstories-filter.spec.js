describe("App.Views.UserStoriesFilter", function () {

    before(function () {
        sinon.spy(App.Views.UserStoriesFilter.prototype, "filterUserStories");

        // Create our base fixture and attach.
        this.$fixture = $(
            "<form class=\"navbar-search\">" +
                "<input type=\"text\" class=\"search-query\">" +
                "</form>" +
                "<div id='userstories'></div>"
        ).appendTo($("#fixtures"));

        // Create fixture / model data for 4 userstories.
        var userstories = _.map(_.range(4), function (i) {
            // Side effect: attach div to fixtures.
            $("#userstories").append($("<div id='" + i + "'></div>"));

            // Create raw model data.
            return { id: "" + i,
                title: "title" + i,
                statement: "statement" + i,
                storyPoints: "?",
                acceptanceCriteria: ["acceptanceCriteria" + i] };
        });

        // Instantiate collection and view.
        this.collection = new App.Collections.UserStories(userstories);
        this.view = new App.Views.UserStoriesFilter({
            collection: this.collection
        });
    });

    beforeEach(function () {
        // Manually reset spy and view state.
        App.Views.UserStoriesFilter.prototype.filterUserStories.reset();
        $(".search-query").val("");
        this.view.query("");
    });

    after(function () {
        App.Views.UserStoriesFilter.prototype.filterUserStories.restore();
        this.view.remove();
        $("#fixtures").empty();
    });

    // -- Omitted in Book. --
    describe("isMatch", function () {
        // Stash a reference within suite. Could just as easily be
        // a context variable (`this.isMatch`).
        var isMatch;

        before(function () {
            // Get reference to function under test, but do it in a
            // `before()` statement to allow any other instrumentation
            // (like code coverage) first.
            isMatch = App.Views.UserStoriesFilter.prototype.isMatch;
        });

        it("works for identity comparisons", function () {
            expect(isMatch()).to.be.true;
            expect(isMatch("", "")).to.be.true;
            expect(isMatch("a", "a")).to.be.true;
            expect(isMatch("ab", "ab")).to.be.true;
        });

        it("should be true on empty query", function () {
            expect(isMatch(null, "foo")).to.be.true;
            expect(isMatch("", "foo")).to.be.true;
        });

        it("can find substring matches", function () {
            expect(isMatch("o", "foo")).to.be.true;
            expect(isMatch("oo", "foo")).to.be.true;
            expect(isMatch("f", "foo")).to.be.true;
            expect(isMatch("short", "a short sentence.")).to.be.true;
        });

        it("should be false on misses", function () {
            expect(isMatch("a", "foo")).to.be.false;
            expect(isMatch("ooo", "foo")).to.be.false;
            expect(isMatch("of", "foo")).to.be.false;
            expect(isMatch("shot", "a short sentence.")).to.be.false;
        });
    });

    describe("with userstories", function () {

        it("shows all userstories by default", function () {
            this.view.filterUserStories();
            expect($("#0").css("display")).to.not.equal("none");
            expect($("#1").css("display")).to.not.equal("none");
            expect($("#2").css("display")).to.not.equal("none");
            expect($("#3").css("display")).to.not.equal("none");
        });

        it("shows filtered userstories", function () {
            $(".search-query").val("tle1");
            this.view.filterUserStories();
            expect($("#0").css("display")).to.equal("none");
            expect($("#1").css("display")).to.not.equal("none");
            expect($("#2").css("display")).to.equal("none");
            expect($("#3").css("display")).to.equal("none");
        });

    });

    describe("filterUserStory", function () {

        it("shows userstory with empty filter", function () {
            // We already have an empty filter applied.
            this.view.filterUserStory(this.collection.at(0));
            expect($("#0").css("display")).to.not.equal("none");
        });

        it("shows userstory with matching filter", sinon.test(function () {
            this.stub(this.view, "query", function () { return "0"; });
            this.view.filterUserStory(this.collection.at(0));
            expect($("#0").css("display")).to.not.equal("none");
        }));

        it("hides userstory on no filter match", sinon.test(function () {
            this.stub(this.view, "query", function () { return "1"; });
            this.view.filterUserStory(this.collection.at(0));
            expect($("#0").css("display")).to.equal("none");
        }));

    });

    // -- Omitted in Book. --
    describe("add a new userstory", function () {

        beforeEach(function () {
            // Add DOM to simulate new element.
            $("<div id='5'></div>").appendTo($("#fixtures"));

            var data = { id: "5", title: "title5", text: "text5" };
            this.model5 = new App.Models.UserStory(data);
        });

        afterEach(function () {
            $("#5").remove();
        });

        // The spy we set on `filterUserStory` illustrates that a callback
        // can only be spied on if it is called on the object, not
        // passed as a raw function pointer.
        //
        it("hides new unmatched userstory", sinon.test(function () {
            this.stub(this.view, "query", function () { return "1"; });
            this.spy(this.view, "filterUserStory");

            expect($("#5").css("display")).to.not.equal("none");

            // Trigger a collection userstories add.
            this.view.collection.trigger("userstories:add", this.model5);

            // Should have hidden element with filterUserStory.
            expect($("#5").css("display")).to.equal("none");
            expect(this.view.filterUserStory).to.have.been.calledOnce;
        }));

        it("shows new matched userstory", sinon.test(function () {
            this.stub(this.view, "query", function () { return "t"; });
            this.spy(this.view, "filterUserStory");

            this.view.collection.trigger("userstories:add", this.model5);

            expect($("#5").css("display")).to.not.equal("none");
            expect(this.view.filterUserStory).to.have.been.calledOnce;
        }));

    });

    // Use our 3 different event triggers: `change`, `keypress`, and
    // `keyup` to call `filterUserStories` and verify the event handlers
    // work in the course of our other tests.
    describe("filterUserStories", function () {

        beforeEach(function () {
            // We stub the collection to check if `each` is called,
            // which is our way of determining if the query text was
            // actually filtered.
            sinon.stub(this.collection, "each");
        });

        afterEach(function () {
            this.collection.each.restore();
        });

        it("doesn't filter by default", function () {
            // Invoke with "change" event.
            $(".search-query").trigger("change");
            expect(this.view.filterUserStories).to.have.been.calledOnce;
            expect(this.collection.each).to.not.have.been.called;
        });

        it("filters userstories if changed query", function () {
            // Invoke with "keypress" event.
            $(".search-query").val("changed");
            $(".search-query").trigger("keypress");

            // `filterUserStories` gets called **every** time, but the
            // collection should only be iterated on **changes**.
            expect(this.view.filterUserStories).to.have.been.calledOnce;
            expect(this.collection.each)
                .to.have.been.calledOnce.and
                .to.have.been.calledWith(this.view.filterUserStory);

            // Second time does not change.
            $(".search-query").trigger("keypress");
            expect(this.view.filterUserStories).to.have.been.calledTwice;
            expect(this.collection.each).to.have.been.calledOnce;

            // -- Omitted in Book. --
            // Change to different should call collection stub.
            $(".search-query").val("different");
            $(".search-query").trigger("keypress");
            expect(this.view.filterUserStories).to.have.been.calledThrice;
            expect(this.collection.each).to.have.been.calledTwice;
        });

        // -- Omitted in Book. --
        it("doesn't filter on same change", function () {
            // Invoke with "keyup" event.
            $(".search-query").val("new value");
            $(".search-query").trigger("keyup");
            expect(this.view.filterUserStories).to.have.been.calledOnce;
            expect(this.collection.each).to.have.been.calledOnce;

            // Check again with value set collection stub isn't called.
            $(".search-query").val("new value");
            $(".search-query").trigger("keyup");
            expect(this.view.filterUserStories).to.have.been.calledTwice;
            expect(this.collection.each).to.have.been.calledOnce;
        });

    });

});
