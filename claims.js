module.exports = {
  todoist: {
    dump: `todoist:get:all`,
    tasks: `todoist:get:tasks`
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
