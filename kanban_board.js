
function round(number){
  return Math.round(number * 100)/100
};

function roll(sides){
  return Math.floor((Math.random() * sides) + 1);
};

function kanban_board() {
  var self = this;
  
  self.todo = ko.observable();
  self.busy = ko.observable();
  self.done = ko.observable();
  self.number_of_iterations = ko.observable();
  self.maximum_transfer = ko.observable(6);

  self.reset = function(){
    self.todo(200);
    self.busy(0);
    self.done(0);
    self.number_of_iterations(0);
  };
  self.reset();

  self.iterate = function(){
    if(self.busy() > 0){
      var work_finished = Math.min(self.busy(), roll(self.maximum_transfer()));
      self.busy(self.busy() - work_finished);
      self.done(self.done() + work_finished);
    }

    if(self.todo() > 0){
      var work_started = Math.min(self.todo(), roll(self.maximum_transfer()));
      self.todo(self.todo() - work_started);
      self.busy(self.busy() + work_started);
    }

    self.number_of_iterations(self.number_of_iterations() + 1);
  };

  self.simulate = function(){
    self.iterate();
    if(self.is_busy()) { setTimeout(simulate, 100) }
  };

  self.is_busy = ko.computed(function(){
    return self.todo() + self.busy() > 0;
  });

  self.througput = ko.computed(function(){
    return round(self.done() / self.number_of_iterations());
  }, self);
};

ko.applyBindings(kanban_board);