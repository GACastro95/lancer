# Lancer

This is a Discord bot using the [sapphire framework][sapphire] written in TypeScript

## How to use it?

### Prerequisite

```sh
yarn add
```

### Development

This example can be run with `tsc-watch` to watch the files and automatically restart your bot.

```sh
yarn run watch:start
```

### Production

You can also run the bot with `yarn dev`, this will first build your code and then run `node ./dist/index.js`. But this is not the recommended way to run a bot in production.

## License

Dedicated to the public domain via the [Unlicense], courtesy of the Sapphire Community and its contributors.

[sapphire]: https://github.com/sapphiredev/framework
[unlicense]: https://github.com/sapphiredev/examples/blob/main/LICENSE.md
