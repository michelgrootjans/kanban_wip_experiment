(function () {
  'use strict';

  describe('a story', function(){
    it('should have a name', function(){
      var story = new Story('my story');
      expect(story.name).toEqual('my story');
    });
  });
})();
