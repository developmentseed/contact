# Contact

Simple email contact form implemented with [express](http://expressjs.com) + [forms](https://github.com/developmentseed/forms) + [node-email](https://github.com/aheckmann/node-email).

## Installation

Add the following line to your ndistro file and rebuild:

    module developmentseed contact

**Note:** You _MUST_ have a `settings.js` file with `toAddress:` (The address at which contact form emails are received.) defined in `module.exports`.

## Requirements

- [express](http://expressjs.com)
- [forms](https://github.com/developmentseed/forms)
- [node-email](https://github.com/aheckmann/node-email)

## Go
- Contact form at `/contact`

## Todo
- Add CAPTCHA