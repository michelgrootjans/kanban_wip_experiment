var kanban_board = {
  backlog: ko.observable(100),
  busy: ko.observable(0),
  done: ko.observable(0),

  iterate: function(){
    if(this.busy() > 0){
      var work_finished = Math.min(this.busy(), this.roll());
      this.busy(this.busy() - work_finished);
      this.done(this.done() + work_finished);
    }

    var work_started = Math.min(this.backlog(), this.roll());
    this.backlog(this.backlog() - work_started);
    this.busy(this.busy() + work_started);
  },

  roll: function(){
    return Math.floor((Math.random() * 6) + 1);
  }
};

ko.applyBindings(kanban_board);