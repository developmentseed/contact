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
var send_mail = function(name, email, message, request, callback) {
    if (name && email && message) {
        var mail = new Email({
            from: email,
            to: settings.toAddress,
            subject: "New email from " + name,
            body: message
        });
        mail.send();
        callback();
    }
    else {
        if (!name) {
            var e = new Error('Name Required');
            e.param = 'name';
        }
        else if (!email) {
            var e = new Error('Email Required');
            e.param = 'email';
        }
        else if (!message) {
            var e = new Error('Message Required');
            e.param = 'message';
        }
        callback(e);
    }
};

/**
 * Export as Common.js module.
 */
module.exports = {
    'send_mail': send_mail
};

// Registers request handlers.
require('./pages');
