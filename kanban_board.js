var kanban_board = {
  backlog: ko.observable(100),
  busy: ko.observable(0),
  done: ko.observable(0)
};

ko.applyBindings(kanban_board)b