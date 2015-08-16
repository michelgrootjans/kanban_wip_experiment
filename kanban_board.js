
function round(number){
  return Math.round(number * 100)/100
};

function roll(sides){
  return Math.floor((Math.random() * sides) + 1);
};

function Story(name){
  var self = this;
  self.name = name;
}

function Column(name){
  var self = this;
  self.name = name;
  self.stories = ko.observableArray();

  self.push = function(story){
    self.stories.push(story);
  };

  self.pop = function(){
    self.stories.pop();
  };

  self.pull_from = function(other_column){
    self.push(other_column.pop());
  };

  self.length = function(){
    return self.stories().length;
  };
}

function KanbanBoard() {
  var self = this;

  self.number_of_columns = ko.observable(5);
  self.maximum_transfer = ko.observable(10);
  self.amount_of_work = ko.observable(100);

  self.work_columns = ko.observableArray();
  self.number_of_iterations = ko.observable();

  self.reset = function(){
    self.work_columns.removeAll();
    for(i=0; i < number_of_columns(); i++){
      self.work_columns.push(new Column("Column " + (i+1)));
    }
    for(i=1; i <= self.amount_of_work(); i++){
      self.work_columns()[0].push(new Story("Story " + i));
    }

    self.number_of_iterations(0);
  };

  self.iterate = function(){

    for(column_index=work_columns().length-1; column_index > 0; column_index--){
      var current_column = work_columns()[column_index];
      var previous_column = work_columns()[column_index - 1];
      var work_finished = Math.min(previous_column.length(), roll(self.maximum_transfer()));
      for(number_of_stories=0; number_of_stories < work_finished; number_of_stories++){
        current_column.pull_from(previous_column);
      }
    };

    if(self.is_busy()){
      self.number_of_iterations(self.number_of_iterations() + 1);
    }
  };

  self.simulate = function(){
    self.iterate();
    if(self.is_busy()) { setTimeout(simulate, 100) }
  };

  self.done = function(){
    return self.work_columns()[work_columns().length-1];
  };

  self.is_busy = function(){
    return self.done().length() < self.amount_of_work();
  };

  self.througput = ko.computed(function(){
    if(self.number_of_iterations() == 0){ return 0; }
    if(self.work_columns().length == 0){ return 0; }
    return round(self.done().length() / self.number_of_iterations());
  }, self);

  self.average_lead_time = ko.computed(function(){
    return 6;
  });
};

ko.applyBindings(KanbanBoard);