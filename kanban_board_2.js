
function Story(name){
  var self = this;

  self.text = "Story " + name;
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

var DoubleColumn = function(name, origin){
  var self = this;

  self.name = name;
  self.origin = origin;
  self.busy = ko.observableArray();
  self.done = ko.observableArray();

  self.work = function(){

  };
  self.pull = function(){
    var story = self.origin.getNextStory();
    self.busy.push(story);
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
    console.log('simulate');
  };

  self.reset = function(){
    backlog.add(new Story("1"));
    backlog.add(new Story("2"));
    backlog.add(new Story("3"));
    backlog.add(new Story("4"));
  };

  self.reset();
};

ko.applyBindings(KanbanBoard);