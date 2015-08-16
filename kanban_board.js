
function round(number){
  return Math.round(number * 100)/100
};

function roll(sides){
  return Math.floor((Math.random() * sides) + 1);
};

function kanban_board() {
  var self = this;
  
  self.todo = ko.observableArray();
  self.busy = ko.observableArray();
  self.done = ko.observableArray();
  self.number_of_iterations = ko.observable();
  self.maximum_transfer = ko.observable(6);

  self.reset = function(){
    self.todo.removeAll();
    for(i=0; i < 200; i++){
      self.todo.push(1);
    }
    self.busy.removeAll();
    self.done.removeAll();
    self.number_of_iterations(0);
  };
  self.reset();

  self.iterate = function(){
    if(self.busy().length > 0){
      var work_finished = Math.min(self.busy().length, roll(self.maximum_transfer()));
      // self.busy(self.busy() - work_finished);
      // self.done(self.done() + work_finished);
      for(i=0; i < work_finished; i++){
        self.done.push(self.busy.pop());
      }
    }

    if(self.todo().length > 0){
      var work_started = Math.min(self.todo().length, roll(self.maximum_transfer()));
      // self.todo(self.todo() - work_started);
      // self.busy(self.busy() + work_started);
      for(i=0; i < work_started; i++){
        self.busy.push(self.todo.pop());
      }
    }

    self.number_of_iterations(self.number_of_iterations() + 1);
  };

  self.simulate = function(){
    self.iterate();
    if(self.is_busy()) { setTimeout(simulate, 100) }
  };

  self.is_busy = ko.computed(function(){
    return self.todo().length + self.busy().length > 0;
  });

  self.througput = ko.computed(function(){
    return round(self.done().length / self.number_of_iterations());
  }, self);
};

ko.applyBindings(kanban_board);