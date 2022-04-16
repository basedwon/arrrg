module.exports = function arrrg(opts = [], examples, argv = process.argv.slice(2)) {
  if (opts.filter(opt => opt.command).length > 1)
    throw new Error(`More than one "command" option is not allowed`)
  const res = { _: [] }
  // parse opts/aliases
  const cmds = {}
  const ops = {}
  let cmd
  for (const opt of opts) {
    if (!opt.name)
      throw new Error(`name is required`)
    ops[opt.name] = cmds[opt.name] = opt
    if (opt.command) {
      cmd = opt.name
      if (opt.aliases)
        throw new Error(`main command should not have aliases`)
      continue
    }
    if (!opt.aliases || !opt.aliases.length)
      continue
    for (const alias of opt.aliases)
      ops[alias] = opt
  }
  // parse args
  let curr
  const orphans = res[cmd] = []
  for (const arg of argv) {
    if (arg.match(/^-{1,2}/)) {
      curr = arg.replace(/^-{1,2}/, '')
      const op = ops[curr]
      if (!op)
        res._.push(arg)
      else
        res[curr] = []
    } else {
      if (!curr)
        orphans.push(arg)
      else {
        const op = ops[curr]
        if (!op)
          res._.push(arg)
        else if (res[curr].length && !op.spaces)
          orphans.push(arg)
        else
          res[curr].push(arg)
      }
    }
  }
  // set results
  const result = {}
  for (const key in res) {
    if (key === '_') {
      result._ = res[key]
      continue
    }
    const op = ops[key]
    const { type } = op
    let val = res[key]
    val = val.join(' ')
    if (type === Boolean)
      val = true
    if (type && typeof type === 'function')
      val = type(val)
    result[op.name] = val
  }
  // set defaults
  for (const key in cmds) {
    const op = cmds[key]
    if ((typeof op.default !== 'undefined') && (typeof result[key] === 'undefined' || result[key] === ''))
      result[key] = op.default
  }
  // define help fn
  const showHelp = () => {
    const help = {}
    let max = 0
    for (const key in cmds) {
      const op = cmds[key]
      if (op.command)
        continue
      let { aliases = [] } = op
      aliases.push(op.name)
      aliases = Array.from(new Set(aliases))
      for (let ii = 0; ii < aliases.length; ii++) {
        const alias = aliases[ii]
        if (alias.length === 1)
          aliases[ii] = `-${alias}`
        else
          aliases[ii] = `--${alias}`
      }
      aliases = aliases.join(', ')
      if (aliases.length > max)
        max = aliases.length
      help[key] = { op, aliases }
    }
    let str = `\n  ${cmd[0].toUpperCase() + cmd.slice(1)}\n\n  Usage: ${cmd} ...args [options]\n\n`
    str += `  Options:\n`
    for (const key in help) {
      const { op, aliases } = help[key]
      const pad = ' '.repeat(max - aliases.length)
      str += '    ' + aliases + '  ' + pad + (op.help || '') + '\n'
    }
    if (examples) {
      str += `\n  Examples:\n`
      for (const example of examples) {
        str += '    ' + example + '\n'
      }
    }
    console.log(str)
  }
  Object.defineProperty(result, 'showHelp', { value: showHelp })
  return result
}
