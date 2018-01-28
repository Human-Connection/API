const path = require('path');
const handlebars = require('handlebars');
const fs = require('fs-extra');
const EmailTemplate = require('email-templates').EmailTemplate;

module.exports = function(app) {
  const returnEmail = app.get('defaultEmail');

  function getLink(type, hash) {
    const frontURL = app.get('frontURL');
    return `${frontURL}/auth/${type}/${hash}`;
  }

  function buildEmail(templatename, title, linktype, user, additionaloptions) {
    handlebars.registerPartial('header',
      fs.readFileSync(path.join(__dirname, '../../../email-templates', 'layout', 'header.hbs'),'utf8')
    );
    handlebars.registerPartial('footer',
      fs.readFileSync(path.join(__dirname, '../../../email-templates', 'layout', 'footer.hbs'),'utf8')
    );

    const templatePath = path.join(__dirname, '../../../email-templates/account', templatename);

    const hashLink = getLink(linktype, user.verifyToken);
    const frontURL = app.get('frontURL');

    const template = new EmailTemplate(templatePath, {juiceOptions: {
      preserveMediaQueries: true,
      preserveImportant: true,
      removeStyleTags: false
    }});

    const options = {
      templatePath: templatePath,
      title: title,
      name: user.name || user.email,
      link: hashLink,
      returnEmail: returnEmail,
      frontURL
    };

    Object.assign(options, additionaloptions);

    template.render(options, (err, result) => {
      if (err && app.get('debug')) {
        app.debug(err);
      }
      const email = {
        from: returnEmail,
        to: user.email,
        subject: result.subject,
        html: result.html,
        text: result.text
      };
      return sendEmail(email);
    });
  }

  function sendEmail(email) {
    // Save copy to /tmp/emails while in debug mode
    if (app.get('debug')) {
      const filename = String(Date.now()) + '.html';
      const filepath = path.join(__dirname, '../../../tmp/emails/', filename);
      fs.outputFile(filepath, email.html)
        .catch(err => {
          app.error('Error saving email', err);
        });
    }

    return app.service('emails').create(email)
      .then(result => {
        app.debug('Sent email', result);
      }).catch(err => {
        app.error('Error sending email', err);
      });
  }

  return {
    notifier: function(type, user) {
      app.get('debug') && app.debug(`-- Preparing email for ${type}`);

      switch (type) {
      case 'resendVerifySignup':
        return buildEmail('verify-email', 'Confirm signup', 'verify', user);
      case 'verifySignup':
        return buildEmail('email-verified', 'Email address verified', 'verify', user);
      case 'resetPwd':
        return buildEmail('reset-password', 'Password reset', 'reset', user);
      case 'sendResetPwd':
        return buildEmail('password-was-reset', 'Your password was reset', 'reset', user);
      case 'passwordChange':
        return buildEmail('password-change', 'Your password was changed', 'reset', user);
      case 'identityChange':
        return buildEmail('identity-change', 'Your account was changed. Please verify the changes', 'verifyChanges', user);
      }
    }
  };
};
