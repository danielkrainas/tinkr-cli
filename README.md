# Tinkr CLI Client

The command line client for the tinkr server.

**Please Note:** this is still a work in progress as I flush out the featureset of both client and server. 

**June 2015 Update:** This project, along with the server, are going to be reworked in Go. There will be a tag on the last node related commit. Afterwords, the project will be restructured.

## Installation

`$ npm install tinkr-cli -g`


## Usage

```
Usage: tinkr [options] [command]

Commands:

  add-remote [name] [host]
  addrelay [projectDir]
  snapshot [projectDir]
  deploy [projectDir]
  init [projectDir]
  projects
  remotes
  snapshots [name]
  relays
  remove-remote [name]
  removerelay [name]

Options:

  -h, --help             output usage information
  -V, --version          output the version number
  -r, --remote [name]    Specify a remote to target.
  -A, --all-remotes      Specifies all remotes as targets.
  -h, --host <hostname>  Hostname setting
  --relay                 Marks the operation as relay-only.
  --proxy <proxy>        Proxy target address
```


## Contributions

Contributions are welcome! Fork and send a PR and I'll see about merging.


## Bugs and Feedback

If you see a bug or have a suggestion, feel free to create an issue [here](https://github.com/danielkrainas/tinkr-cli/issues).


## License

MIT License. Copyright 2014 Daniel Krainas [http://www.danielkrainas.com](http://www.danielkrainas.com)

