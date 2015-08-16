function kanban_board() {
  this.todo = ko.observable(100);
  this.busy = ko.observable(0);
  this.done = ko.observable(0);
  this.number_of_iterations = ko.observable(0);

  this.iterate = function(){
    if(this.busy() > 0){
      var work_finished = Math.min(this.busy(), this.roll());
      this.busy(this.busy() - work_finished);
      this.done(this.done() + work_finished);
    }

    if(this.todo() > 0){
      var work_started = Math.min(this.todo(), this.roll());
      this.todo(this.todo() - work_started);
      this.busy(this.busy() + work_started);
    }

    this.number_of_iterations(this.number_of_iterations() + 1);
  };

  this.round = function(number){
    return Math.round(number * 100)/100
  };

  this.roll = function(){
    return Math.floor((Math.random() * 6) + 1);
  };

  this.reset = function(){
    this.todo(100);
    this.busy(0);
    this.done(0);
    this.number_of_iterations(0);
  };

  this.shipped_per_iteration = ko.computed(function(){
    return this.round(this.done() / this.number_of_iterations());
  }, this);
};

ko.applyBindings(kanban_board);