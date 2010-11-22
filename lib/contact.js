var mail_lib = require('node-email'),
    settings = require('settings'),
    Email = mail_lib.Email;

/**
 * Sends email from the contact form.
 *
 * @param name
 *   The sender's name.
 * @param email
 *   The senders's email address.
 * @param request
 *   An HTTP request object.
 * @param callback
 *   Callback invoked after send_mail. Receives an error object.
 *   The error contains a property 'param' indicating the
 *   parameter that caused the error ('name' or 'email' or 'message');
 */
var send_mail = function(name, email, message, callback) {
    if (name && email && message) {
        var mail = new Email({
            to: settings.contact.toAddress,
            from: email,
            subject: 'New email from ' + name,
            body: message
        });
        mail.send(function(err) {
            if (err) {
                if (err.message) {
                    if (err.message.match(/invalid email address/)) {
                        console.log(err);
                        var e = new Error('Email address not valid');
                        e.param = 'email';
                        callback(e);
                    }
                    else {

                    }
                }
            }
            callback();
        });
    }
    else {
        if (!name) {
            var e = new Error('Name is required');
            e.param = 'name';
        }
        else if (!email) {
            var e = new Error('Email is required');
            e.param = 'email';
        }
        else if (!message) {
            var e = new Error('Message is required');
            e.param = 'message';
        }
        callback(e);
    }
};

/**
 * Defines reCaptcha for use in contact_form_def if
 * reCaptcha is enabled in settings.js.
 */
var recaptcha_def = function() {
    Recaptcha = require('recaptcha').Recaptcha;

    var recaptcha = new Recaptcha(
        settings.contact.reCaptcha.publicKey,
        settings.contact.reCaptcha.privateKey
    );
    return recaptcha;
};

var recaptcha_validation = function(name, email, message, request, form, callback) {
    var data = {
        remoteip: request.connection.remoteAddress,
        challenge: form.data.recaptcha_challenge_field,
        response: form.data.recaptcha_response_field
    };
    var recaptcha = new Recaptcha(
        settings.contact.reCaptcha.publicKey,
        settings.contact.reCaptcha.privateKey,
        data
    );
    recaptcha.verify(function(success, error_code) {
        if (success) {
            send_mail(name, email, message, callback);
        }
        else {
            var e = new Error('ReCaptcha is not valid.');
            e.param = 'recaptcha';
            callback(e)
        }
    });
};

/**
 * Export as Common.js module.
 */
module.exports = {
    'send_mail': send_mail,
    'recaptcha_def': recaptcha_def,
    'recaptcha_validation': recaptcha_validation
};

// Registers request handlers.
require('./pages');
