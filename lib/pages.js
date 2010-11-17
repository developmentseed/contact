var app = require('server'),
    contact = require('./contact'),
    forms = require('forms'),
    validators = forms.validators;

/**
 * Handles get requests for contact form
 */
app.get('/contact', function(req, res, next) {
    contact_form_def(req, res, next);
});

/**
 * Handles post requests for contact form
 */
app.post('/contact', function(req, res, next) {
    contact_form_def(req, res, next);
});

/**
 * Form definition for contact form.
 */
function contact_form_def(req, res, next) {
    var form = new forms.Form({
        fields: function() {
            var field_def = {};

            field_def['name'] = forms.fields.string({
                label: 'Name',
                required: true,
                widget: forms.widgets.text({classes: ['text']})
            });
            field_def['email'] = forms.fields.string({
                label: 'Email Address',
                required: true,
                validators: [validators.email()],
                widget: forms.widgets.text({classes: ['text']})
            });
            field_def['message'] = forms.fields.string({
                label: 'Message',
                required: true,
                widget: forms.widgets.textarea({classes: ['text']})
            });
            field_def['send'] = forms.fields.submit({
                value: 'Send',
                submit: function(form, req, res) {
                    for (var k in form.def.fields) {
                        if (k == 'name') {
                            name = form.def.fields[k].value;
                        }
                        else if (k == 'email') {
                            email = form.def.fields[k].value;
                        }
                        else if (k == 'message') {
                            message = form.def.fields[k].value;
                        }
                    }
                    contact.send_mail(name, email, message, req, function(err) {
                        if (err) {
                            form.def.fields[err.param].error = err.message;
                            res.render('content', {
                                locals: {
                                    pageTitle: 'Contact',
                                    title: 'Contact',
                                    content: form.toHTML()
                                }
                            });
                        }
                        else {
                            res.redirect('/contact');
                        }
                    });
                }
            });
            return field_def;
        },
        render: function(form, req, res) {
            res.render('content', {
                locals: {
                    pageTitle: 'Contact',
                    title: 'Contact',
                    content: form.toHTML()
                }
            });
        }
    });
    // Delegate request handling to form.
    form.handle(req, res, next);
};
