# Contact

Simple email contact form for [expresslane](https://github.com/developmentseed/expresslane) implemented with [express](http://expressjs.com) + [forms](https://github.com/developmentseed/forms) + [node-email](https://github.com/aheckmann/node-email) .

## Installation

Add the following line to your ndistro file and rebuild:

    module developmentseed contact

**Note:** You _MUST_ define contact in `settings.js` with at least a `toAddress:` element (The address at which contact form emails are received.).

## Requirements

- [express](http://expressjs.com)
- [forms](https://github.com/developmentseed/forms)
- [node-email](https://github.com/aheckmann/node-email)

## Go
- Contact form at `/contact`

## reCAPTCHA

Optionally you can enable a [reCAPTCHA](http://www.google.com/recaptcha) field to the contact form. To enable add [node-recaptcha](https://github.com/mirhampt/node-recaptcha) to your project and add a `reCaptcha` element to contact in `settings.js` like so.

    contact: {
          toAddress: 'email@domain.com',
          reCaptcha: {
              publicKey: '6LeN9L4SAAAAAOa-DmhOqGsdLQxTkUYFHAlyDKp6',
              privateKey: '6LeN9L4SAAAAAP1tdRiHki0wdz_5URa-_AUbFPOJ'
          }
      }
