(function () {
  'use strict';

  describe('A single column', function () {
    it('should have a name', function () {
      var backlog = new SingleColumn("TODO");
      expect(backlog.name).toEqual("TODO")
    });

    it('can add a story', function () {
      var backlog = new SingleColumn("TODO");
      backlog.add('story 1');
      expect(backlog.stories()).toEqual(['story 1'])
    });
  });

  describe('A double column', function () {
    it('should have a name', function () {
      var wip = new DoubleColumn("WIP");
      expect(wip.name).toEqual("WIP")
    });

    it('should finish its work', function(){
      var wip = new DoubleColumn("WIP");
      wip.busy().push('story 1');
      wip.work();
      expect(wip.busy().length).toEqual(0);      
      expect(wip.done()).toEqual(['story 1']);      
    });

    describe('with an origin', function(){
      it('should pull a story from its origin', function(){
        var backlog = new SingleColumn("TODO");
        backlog.add('story 1');
        var wip = new DoubleColumn("WIP", backlog);

        wip.pull();
        expect(backlog.stories()).toEqual([])
        expect(wip.busy()).toEqual(['story 1']);
      });
    });

    describe('with an empty origin', function(){
      it('should not pull a story from its origin', function(){
        var backlog = new SingleColumn("TODO");
        var wip = new DoubleColumn("WIP", backlog);

        wip.pull();
        expect(wip.busy()).toEqual([]);
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
        expect(backlog.stories()).toEqual(['story 3'])
        expect(wip.busy()).toEqual(['story 1', 'story 2']);
      });
    });

  });
})();