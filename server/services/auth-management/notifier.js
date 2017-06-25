const isProd = process.env.NODE_ENV === 'production';
const path = require('path');
const jade = require('jade');
const handlebars = require('handlebars');
const fs = require('fs');
const EmailTemplate = require('email-templates').EmailTemplate;

module.exports = function(app) {

  const returnEmail = app.get('defaultEmail');

  function getLink(type, hash) {
    var port = (app.get('port') === '80' || isProd)? '': ':' + app.get('port');
    var host = (app.get('host') === 'HOST')? 'localhost': app.get('host');
    var protocal = (app.get('protocal') === 'PROTOCAL')? 'http': app.get('protocal');
    protocal += '://';
    return `${protocal}${host}${port}/login/${type}/${hash}`;
  }

  function sendEmail(email) {
    const filename = String(Date.now()) + '.html';
    fs.writeFile(path.join(__dirname, '../../../data/emails/', filename), email.html);

    return app.service('emails').create(email).then(function (result) {
      console.log('Sent email', result);
    }).catch(err => {
      console.log('Error sending email', err);
    });
  }

  return {
    notifier: function(type, user) {
      console.log(`-- Preparing email for ${type}`);
      handlebars.registerPartial('header',
        fs.readFileSync(path.join(__dirname, '../../../email-templates', 'layout', 'header.hbs'),'utf8')
      );
      handlebars.registerPartial('footer',
        fs.readFileSync(path.join(__dirname, '../../../email-templates', 'layout', 'footer.hbs'),'utf8')
      );

      var hashLink;
      var email;
      var emailAccountTemplatesPath = path.join(__dirname, 'email-templates', 'account');
      var templatePath;
      var compiledHTML;
      let mailConfig = app.get('mail');
      let logo = mailConfig.logo;
      switch (type) {
      case 'resendVerifySignup': // send another email with link for verifying user's email addr

        hashLink = getLink('verify', user.verifyToken);

        emailAccountTemplatesPath = path.join(__dirname, '../../../email-templates', 'account');
        templatePath = path.join(emailAccountTemplatesPath, 'verify-email');
        let template = new EmailTemplate(templatePath, {juiceOptions: {
          preserveMediaQueries: true,
          preserveImportant: true,
          removeStyleTags: false
        }});
        let options = {
          templatePath: templatePath,
          title: 'Confirm Signup',
          name: user.name || user.email,
          link: hashLink,
          returnEmail
        };

        template.render(options, (err, result) => {
          console.log(err);
          email = {
            from: returnEmail,
            to: user.email,
            subject: result.subject,
            html: result.html,
            text: result.text
          };

          return sendEmail(email);
        })
        break;
      case 'verifySignup': // inform that user's email is now confirmed

        hashLink = getLink('verify', user.verifyToken);

        templatePath = path.join(emailAccountTemplatesPath, 'email-verified.jade');

        compiledHTML = jade.compileFile(templatePath)({
          logo: logo,
          name: user.name || user.email,
          hashLink,
          returnEmail
        });

        email = {
          from: returnEmail,
          to: user.email,
          subject: 'Thank you, your email has been verified',
          html: compiledHTML
        };

        return sendEmail(email);
      case 'sendResetPwd': // inform that user's email is now confirmed

        hashLink = getLink('reset', user.resetToken);

        templatePath = path.join(emailAccountTemplatesPath, 'reset-password.jade');

        compiledHTML = jade.compileFile(templatePath)({
          logo: logo,
          name: user.name || user.email,
          hashLink,
          returnEmail
        });

        email = {
          from: returnEmail,
          to: user.email,
          subject: 'Reset Password',
          html: compiledHTML
        };

        return sendEmail(email);
      case 'resetPwd': // inform that user's email is now confirmed

        hashLink = getLink('reset', user.resetToken);

        templatePath = path.join(emailAccountTemplatesPath, 'password-was-reset.jade');

        compiledHTML = jade.compileFile(templatePath)({
          logo: logo,
          name: user.name || user.email,
          hashLink,
          returnEmail
        });

        email = {
          from: returnEmail,
          to: user.email,
          subject: 'Your password was reset',
          html: compiledHTML
        };

        return sendEmail(email);
      case 'passwordChange':

        templatePath = path.join(emailAccountTemplatesPath, 'password-change.jade');

        compiledHTML = jade.compileFile(templatePath)({
          logo: logo,
          name: user.name || user.email,
          returnEmail
        });

        email = {
          from: returnEmail,
          to: user.email,
          subject: 'Your password was changed',
          html: compiledHTML
        };

        return sendEmail(email);
      case 'identityChange':
        hashLink = getLink('verifyChanges', user.verifyToken);

        templatePath = path.join(emailAccountTemplatesPath, 'identity-change.jade');

        compiledHTML = jade.compileFile(templatePath)({
          logo: logo,
          name: user.name || user.email,
          hashLink,
          returnEmail,
          changes: user.verifyChanges
        });

        email = {
          from: returnEmail,
          to: user.email,
          subject: 'Your account was changed. Please verify the changes',
          html: compiledHTML
        };

        return sendEmail(email);
      default:
        break;
      }
    }
  };
};
