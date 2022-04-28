# Arrrg

`arrrg` is a simple CLI argument parser.

## Installation

```sh
npm install arrrg
```

## Usage

`arrrg(definition, [defaults], [examples], [argv])`

## Example

```js
const Arrrg = require('arrrg')

const definition = [
  { name: 'servn', type: String, command: true, default: '.', swap: 'docroot' },
  { name: 'host', type: String, help: 'define the host', default: 'localhost' },
  { name: 'file', type: String, aliases: ['f'], help: 'define the file', default: 'main.js' },
  { name: 'port', type: Number, aliases: ['p'], help: 'define the port', default: 8080 },
  { name: 'cert', help: 'define the TLS cert' },
  { name: 'help', type: Boolean, aliases: ['h', 'help'], help: 'show this dialog' },
]
const defaults = {
  host: 'localhost',
  file: 'main.js'
}
const examples = [
  `servn`,
  `servn -p 3000`,
  `servn ~/project --host example.com --file index.js`,
]
const argv = ['.', '--cert', 'localhost-key.pem', '--help']
const opts = Arrrg(definition, defaults, examples, argv)

console.log(opts)
/*
{
  _: [],
  servn: '.',
  cert: 'localhost-key.pem',
  help: true,
  host: 'localhost',
  file: 'main.js',
  port: 8080
}
*/

if (opts.help)
  return opts.showHelp() // showHelp result:
/*
  Servn

  Usage: servn ...args [options]

  Options:
    --host      define the host
    -f, --file  define the file
    -p, --port  define the port
    --cert      define the TLS cert
    -h, --help  show this dialog

  Examples:
    servn
    servn -p 3000
    servn ~/project --host example.com --file index.js
*/
```
