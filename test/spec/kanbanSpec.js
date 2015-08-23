(function () {
  'use strict';

  describe('A single column', function () {
    it('should have a name', function () {
      var backlog = new SingleColumn("TODO");
      expect(backlog.name).toEqual("TODO")
    });

    it('can add a story', function () {
      var backlog = new SingleColumn("TODO");
      backlog.add('story');
      expect(backlog.stories().length).toEqual(1)
    });
  });

  describe('A double column', function () {
    it('should have a name', function () {
      var wip = new DoubleColumn("WIP");
      expect(wip.name).toEqual("WIP")
    });

    describe('with an origin', function(){
      it('should pull a story from its origin', function(){
        var backlog = new SingleColumn("TODO");
        backlog.add('a story');
        var wip = new DoubleColumn("WIP", backlog);

        wip.pull();
        expect(backlog.stories().length).toEqual(0)
        expect(wip.busy().length).toEqual(1);
      });
    });

    describe('with an empty origin', function(){
      it('should not pull a story from its origin', function(){
        var backlog = new SingleColumn("TODO");
        var wip = new DoubleColumn("WIP", backlog);

        wip.pull();
        expect(wip.busy().length).toEqual(0);
      });
    });

    describe('with a full wip-limit', function(){
      it('should not pull  a story from its origin', function(){
        var backlog = new SingleColumn("TODO");
        backlog.add('story 1');
        backlog.add('story 2');
        backlog.add('story 3');
        var wip = new DoubleColumn("WIP", backlog, 2);

        wip.pull();
        wip.pull();
        wip.pull();
        expect(backlog.stories().length).toEqual(1)
        expect(wip.busy().length).toEqual(2);
      });
    });

  });
})();
