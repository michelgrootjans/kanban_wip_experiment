
function Story(name){
  var self = this;

  self.name = "Story " + name;
};

var SingleColumn = function(name){
  var self = this;

  self.name = name;
  self.stories = ko.observableArray();

  self.add = function(story){
    self.stories().push(story);
  }
  self.getNextStory = function(){
    return self.stories().shift();
  }

  self.work = function(){};
  self.pull = function(){};
};

var DoubleColumn = function(name, origin, wipLimit){
  var self = this;

  self.name = name;
  self.origin = origin;
  self.busy = ko.observableArray();
  self.done = ko.observableArray();
  self.wip_limit = ko.observable(typeof wipLimit !== 'undefined' ?  wipLimit : 3);

  self.work = function(){
    var story = self.busy.pop();
    if(typeof story === 'undefined') return;
    self.done.push(story);
  };

  self.pull = function(){
    if(wipLimitReached()) return;

    var story = self.origin.getNextStory();
    if(typeof story === 'undefined') return;

    self.busy.push(story);
  };

  wipLimitReached = function(){ 
    return self.busy().length >= self.wip_limit(); 
  };
};

var KanbanBoard = function() {
  var self = this;

  self.backlog = new SingleColumn("Backlog");
  self.wip = new DoubleColumn("Work", self.backlog);

  var columns = [self.wip];

  self.iterate = function(){
    for(i=0; i < columns.length; i++){
      columns[i].work();
      columns[i].pull();
    }
  };

  self.simulate = function(){
    backlog.stories().clear();
  };

  self.reset = function(){
    wip.done.push(new Story("1"));
    wip.busy.push(new Story("2"));
    backlog.add(new Story("3"));
    backlog.add(new Story("4"));
    backlog.add(new Story("5"));
  };

  self.reset();
};

ko.applyBindings(KanbanBoard);