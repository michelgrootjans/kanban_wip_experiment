
function Story(name){
  var self = this;

  self.name = name;
};

var SingleColumn = function(name){
  var self = this;

  self.name = name;
  self.stories = ko.observableArray();

  self.push = function(story){
    self.stories.push(story)
  };

  self.shift = function(){
    return self.stories.shift();
  };
};

var DoubleColumn = function(name, origin, wipLimit){
  var self = this;

  self.name = name;
  self.origin = origin;
  self.busy = ko.observableArray();
  self.done = ko.observableArray();
  self.wip_limit = ko.observable(typeof wipLimit !== 'undefined' ?  wipLimit : 3);

  self.work = function(){
    var story = self.busy.shift();
    if(typeof story === 'undefined') return;
    self.done.push(story);
  };

  self.pull = function(){
    if(wipLimitReached()) return;

    var story = self.origin.shift();
    if(typeof story === 'undefined') return;

    self.busy.push(story);
  };

  self.shift = function(){
    return self.done.shift();
  };

  self.push = function(story){
    self.busy.push(story);
  };

  wipLimitReached = function(){ 
    return self.busy().length >= self.wip_limit(); 
  };
};

var KanbanBoard = function() {
  var self = this;

  self.backlog = new SingleColumn("Backlog");
  self.columns = ko.observableArray();

  var previous_column = self.backlog;
  for(i=0; i<4; i++){
    var new_column = new DoubleColumn("Column " + (i+1), previous_column);
    self.columns.push(new_column);
    previous_column = new_column;
  }

  self.iterate = function(){
    for(i=columns().length-1; i >= 0 ; i--){
      self.columns()[i].work();
      self.columns()[i].pull();
    }    
  };

  self.simulate = function(){
    backlog.stories().clear();
  };

  self.reset = function(){
    for(i=0; i<20; i++){
      backlog.push(new Story("Story " + (i+1)));
    }
  };

  self.reset();
};

ko.applyBindings(KanbanBoard);