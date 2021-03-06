function round(number){
  return Math.round(number * 100)/100
};

function roll(sides){
  return Math.floor(Math.random() * sides);
};

function Story(name){
  var self = this;
  self.name = name;
  self.lead_time = 0;

  self.increase_lead_time = function(){
    self.lead_time++;
  };
}

function Column(name){
  var self = this;
  self.name = name;
  self.stories = ko.observableArray();

  self.push = function(story){
    self.stories.push(story);
  };

  self.pop = function(){
    return self.stories.pop();
  };

  self.pull_from = function(other_column){
    self.push(other_column.pop());
  };

  self.length = function(){
    return self.stories().length;
  };

  self.increase_lead_time = function(){
    for(i = 0; i < self.stories().length; i++){
      self.stories()[i].increase_lead_time();
    }
  };
}

function KanbanBoard() {
  var self = this;

  self.number_of_columns = ko.observable(8);
  self.maximum_transfer = ko.observable(5);
  self.amount_of_work = ko.observable(100);

  self.work_columns = ko.observableArray();
  self.number_of_iterations = ko.observable();
  self.statistics = ko.observableArray();

  self.reset = function(){
    self.work_columns.removeAll();
    for(column_number=0; column_number < number_of_columns(); column_number++){
      self.work_columns.push(new Column("Column " + (column_number+1)));
    }
    for(story_index=1; story_index <= self.amount_of_work(); story_index++){
      self.work_columns()[0].push(new Story("Story " + story_index));
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

    for(column_index=0; column_index < workers().length; column_index++){
      workers()[column_index].increase_lead_time();
    };

    if(self.is_busy()){
      self.number_of_iterations(self.number_of_iterations() + 1);
    }
    else{
      self.statistics.push({
        number_of_columns: self.number_of_columns.peek(),
        maximum_transfer: self.maximum_transfer.peek(),
        amount_of_work: self.amount_of_work.peek(),
        number_of_iterations: self.number_of_iterations.peek(),
        througput: self.througput.peek(),
        average_lead_time: self.average_lead_time.peek()
      });
    }
  };

  self.simulate = function(){
    self.iterate();
    if(self.is_busy()) { setTimeout(simulate, 100) }
  };

  self.workers = function(){
    return work_columns().slice(1, -1);
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
    if(typeof done() == 'undefined') return 0;
    if(done().length() == 0) return 0;
    var lead_time = 0;
    for(i=0; i<done().length(); i++){
      lead_time += done().stories()[i].lead_time;
    }
    return round(lead_time / done().length());
  });
};

ko.applyBindings(KanbanBoard);