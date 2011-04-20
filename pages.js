var app = require('expresslane').app,
    contact = require('contact'),
    forms = require('forms'),
    view = require('expresslane').view,
    settings = require('settings'),
    mail_lib = require('node-email'),
    Recaptcha = require('recaptcha').Recaptcha,
    validators = forms.validators;

var contactForm = forms.Form.create({
    CSRF: true,
    view: view('content'),
    locals: {
      pageTitle: 'Contact',
      title: 'Contact',
      suppressTitle: true,
    },

    // Fields to display in form.
    fields: {
        name: forms.fields.string({
            label: 'Name',
            required: true,
            widget: forms.widgets.text({classes: ['text']})
        }),
        email: forms.fields.string({
            label: 'Email Address',
            required: true,
            widget: forms.widgets.text({classes: ['text']}),
            validators: [validators.email()],
        }),
        message: forms.fields.string({
            label: 'Message',
            required: true,
            widget: forms.widgets.textarea({classes: ['text']})
        }),
        submit: forms.fields.submit({
            value: 'Send',
            classes: ['action', 'submit'],
        }),

    },
});

if (settings.contact.reCaptcha) {
    var recaptcha = new Recaptcha(
        settings.contact.reCaptcha.publicKey,
        settings.contact.reCaptcha.privateKey
    );
    contactForm.prototype.fields['recaptcha'] = forms.fields.html({
        label: 'ReCaptcha',
        value: recaptcha.toHTML()
    });

    contactForm.prototype.visible_fields = ['recaptcha', 'name', 'email', 'message', 'submit'];
}

// @TODO re-add recaptcha support
// @TODO fix validators code in fields.js to 
// return errors keyed on field name and not
// numeric key.

// Validate the form.
contactForm.on('validate', function(req, res, track) {
    var that = this;

    if (!mail_lib.isValidAddress(this.instance.email)) {
        this.errors['email'] = "Invalid email address.";
    }
    if (this.fields.recaptcha) {

        var data = {
            remoteip: req.connection.remoteAddress,
            challenge: this.instance.recaptcha_challenge_field,
            response: this.instance.recaptcha_response_field
        };
        var recaptcha = new Recaptcha(
            settings.contact.reCaptcha.publicKey,
            settings.contact.reCaptcha.privateKey,
            data
        );

        recaptcha.verify(track(function(success, error_code) {
            if (!success) {
                that.errors['recaptcha'] = 'ReCaptcha is not valid.';
            }
        }));
    }
});

// Actions to take when validation succeeds.
contactForm.on('success', function(req, res, track) {
    var that = this;
    var name = this.instance.name,
        email = this.instance.email,
        message = this.instance.message;
    contact.send_mail(name, email, message, track(function(err) {
        if (!err) {
            res.render('content', { 
                locals: { 
                    content: 'Thank you for your feedback.'
                }
            });
        }
        else {
            that.errors['email'] = "Unable to send email.";
            that.render(req, res);
        }
    }));
});

app.get('/contact', contactForm.load(), function(req, res, next) {
    req.form.render(req, res, next);
});

app.post('/contact', contactForm.load(), function(req, res, next) {
    req.form.process(req, res, next);
});
