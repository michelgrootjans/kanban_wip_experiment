(function () {
  'use strict';

  describe('A single column', function () {
    it('should have a name', function () {
      var backlog = new SingleColumn("TODO");
      expect(backlog.name).toEqual("TODO")
    });

    it('can add a story', function () {
      var backlog = new SingleColumn("TODO");
      backlog.push('story 1');
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
      wip.push('story 1');
      wip.work();
      expect(wip.busy()).toEqual([]);      
      expect(wip.done()).toEqual(['story 1']);      
    });

    it('should finish its first story first', function(){
      var wip = new DoubleColumn("WIP");
      wip.push('story 1');
      wip.push('story 2');
      wip.work();
      expect(wip.busy()).toEqual(['story 2']);      
      expect(wip.done()).toEqual(['story 1']);      
    });

    it('should not work if there is no work', function(){
      var wip = new DoubleColumn("WIP");
      wip.work();
      expect(wip.busy()).toEqual([]);      
      expect(wip.done()).toEqual([]);      
    });

    describe('with an origin', function(){
      it('should pull a story from its origin', function(){
        var backlog = new SingleColumn("TODO");
        backlog.push('story 1');
        var wip = new DoubleColumn("WIP", backlog);

        wip.pull();
        expect(backlog.stories()).toEqual([])
        expect(wip.busy()).toEqual(['story 1']);
      });
    });

    describe('with an empty origin', function(){
      it('should not pull a story from its origin', function(){
        var backlog = [];
        var wip = new DoubleColumn("WIP", backlog);

        wip.pull();
        expect(wip.busy()).toEqual([]);
      });
    });

    describe('with a full wip-limit', function(){
      it('should not pull  a story from its origin', function(){
        var backlog = ['story 1', 'story 2', 'story 3'];
        var wip = new DoubleColumn("WIP", backlog, 2);

        wip.pull();
        wip.pull();
        wip.pull();
        expect(backlog).toEqual(['story 3'])
        expect(wip.busy()).toEqual(['story 1', 'story 2']);
      });
    });

  });
})();
