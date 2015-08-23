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
      wip.can_finish = function(){ return true; };
      wip.work();
      expect(wip.busy()).toEqual([]);      
      expect(wip.done()).toEqual(['story 1']);      
    });

    it('should not finish its work if its not done', function(){
      var wip = new DoubleColumn("WIP");
      wip.push('story 1');
      wip.can_finish = function(){ return false; };
      wip.work();
      expect(wip.busy()).toEqual(['story 1']);      
      expect(wip.done()).toEqual([]);      
    });

    it('should finish its first story first', function(){
      var wip = new DoubleColumn("WIP");
      wip.push('story 1');
      wip.push('story 2');
      wip.can_finish = function(){ return true; };
      wip.work();
      expect(wip.busy()).toEqual(['story 2']);      
      expect(wip.done()).toEqual(['story 1']);      
    });

    it('should not work if there is no work', function(){
      var wip = new DoubleColumn("WIP");
      wip.can_finish = function(){ return true; };
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

  describe('two double columns', function(){
      it('should pull stories from each other', function(){
        var backlog = ['story 1'];
        var work1 = new DoubleColumn("1", backlog, 2);
        work1.can_finish = function(){ return true; };
        var work2 = new DoubleColumn("2", work1, 2);

        work1.pull();
        work1.work();
        work2.pull();

        expect(backlog).toEqual([])
        expect(work1.busy()).toEqual([]);
        expect(work1.done()).toEqual([]);
        expect(work2.busy()).toEqual(['story 1']);
      });
  });
})();
