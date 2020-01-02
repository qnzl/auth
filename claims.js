module.exports = {
  todoist: {
    dump: `todoist:get:all`,
    get: {
      tasks: `todoist:get:tasks`,
      comments: `todoist:get:comments`,
    }
  },
  existio: {
    dump: `existio:get:all`,
    get: {
      multiple: `existio:get:multiple`,
      single: `existio:get:single`
    }
  },
  plaid: {
    dump: `plaid:get:all`
  },
  trello: {
    dump: `trello:get:all`
  },
  activityWatch: {
    dump: `aw:get:all`,
    get: `aw:get:bucket`
  }
}
