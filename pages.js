var app = require('expresslane').app,
    contact = require('./contact'),
    forms = require('forms'),
    view = require('expresslane').view,
    settings = require('settings'),
    validators = forms.validators;

var contactForm = forms.Form.create({
    view: view('content'),
    locals: {
      pageTitle: 'Contact',
      title: 'Contact',
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

// @TODO re-add recaptcha support
// @TODO fix validators code in fields.js to 
// return errors keyed on field name and not
// numeric key.

// Validate the form.
contactForm.on('validate', function(req, res) {
    // @TODO
});

// Actions to take when validation succeeds.
contactForm.on('success', function(req, res) {
    var name = this.instance.name,
        email = this.instance.email,
        message = this.instance.message;
    contact.send_mail(name, email, message, function(err) {
        if (!err) {
            res.redirect('/contact');
        }
    });
});

app.get('/contact', contactForm.load(), function(req, res, next) {
    req.form.render(req, res, next);
});

app.post('/contact', contactForm.load(), function(req, res, next) {
    req.form.process(req, res, next);
});
