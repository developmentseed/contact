# Contact

Simple email contact form implemented with [express](http://expressjs.com) + [forms](https://github.com/developmentseed/forms) + [node-email](https://github.com/aheckmann/node-email).

## Installation

Add the following line to your ndistro file and rebuild:

    module developmentseed contact

**Note:** You _MUST_ have a <code>settings.js</code> file with <code>toAddress:</code> (The address at which contact form emails are received.) defined in <code>module.exports</code>.

## Requirements

- [express](http://expressjs.com)
- [forms](https://github.com/developmentseed/forms)
- [node-email](https://github.com/aheckmann/node-email)

## Go
- Contact form at `/contact`

## Todo
- Add CAPTCHA