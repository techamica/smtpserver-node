
![Logo](https://smtpserver.com/documentation/img/logo.png)


# smtpserver-node

API vendor in Node.js for https://smtpserver.com. Mail sending is now super easy!




## License

[MIT](https://choosealicense.com/licenses/mit/)

![MIT_logo](https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png)


## Contents

- [Installation](#installation)
- [Documentation](#documentation)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Used By](#used-by)
## Installation

Install `@techamica/smtpserver-node` with `npm`

```bash
  npm install @techamica/smtpserver-node
```
    
## Documentation

After installing `@techamica/smtpserver-node` create a new js file and include the `SmtpMailer`class.

```bash
  const SmtpMailer = require('@techamica/smtpserver-node')
```
Next, create an object of `SmtpMailer` class. This will require you 96-character `API KEY`.

```bash
  const mailer = new SmtpMailer('YOUR_API_KEY')
```
Now set `To` mail. You can pass only one `String`(email), or an `Array` of `Strings`(emails) in order to send mail to multiple recipients at once.

```bash
  mailer.setTo('test1@test.com')
  mailer.setTo([ 'test2@test.com', 'test3@test.com' ])
```
But, if you want to add recipients' names, you must pass an `Object` of `email ids` and `names`. Some of the `names` can be empty `String`, if you want.

```bash
  mailer.setTo({ 
    'test4@test.com': 'Tester 4', 
    'test5@test.com': 'Tester 5',
    'test6@test.com': ''
  })
```
`To` mail is mandatory in order to send mail.

Next, set `From` mail. Simply pass `from mail id` and `name` into the method. `name` is `optional`.

```bash
  mailer.setFrom('info@test.com', 'Good Sender')
```
`From` mail is mandatory in order to send mail.

Next, set `Subject` of the mail. This is an `optional` step.

```bash
  mailer.setSubject('Test subject for a test mail. Nothing to worry!')
```
Next, set `Custom Headers`. This is also an `optional` step.

```bash
  mailer.setHeader({
    'Custom-Header-1': '<https://www.google.com>',
    'Custom-Header-2': '<https://www.google.com?source=email-client-unsubscribe-button>',
    'Custom-Header-3': 'ABCD-17G5-098H-F5TS-0865'
  })
```
Set `Attachments`, if there's any. You can attach just one file by passing its path as a `String` or you can pass multiple file paths in an `Array`. But remember to put `absolute path` to the files and the total size of attachments should not exceed `25MB`. This is an `optional`step.

```bash
  mailer.addFile([
    "ABSOLUTE_PATH_TO/web.zip",
    "ABSOLUTE_PATH_TO/photo_2019-02-08_00-01-11.jpg",
    "ABSOLUTE_PATH_TO/mongodb_ the definitive guide - kristina chodorow_1401.pdf"
  ])
```
Set `timeout` for mail sending. Default timeout is `20sec`. Depending on the attachment size & internet connection this can be set to some other value. To set a new timeout, pass the value in `seconds`.

```bash
  mailer.setTimeout(60)
```

Set `HTML` & `Text`. Either of these two is `mandatory`. It's a good practice to put both.

```bash
  mailer.setText('This is a test mail only. No need to pay attention, right?')
  mailer.setHtml('<p>This is a test mail only.</p><p> No need to pay attention, right?</p>')
```
Finally, send mail. This method either `returns` a `Promise` or `throws Error` for any setup-related issue. So make sure to use a `catch` block with this method.

```bash
  mailer.sendMail().then(console.log).catch(console.error)
```
Output, after `Promise resolved`, looks like:

```bash
  { code: 200, headers: { ... }, success: 1, message: 'Mail accepted' }
```
If there's error while sending mail, the output looks like:

```bash
  { code: ERROR_CODE, headers: { ... }, success: 0, message: 'SOME ERROR MESSAGE' }
```
## Screenshots

![CompleteCode Screenshot](https://smtpserver.com/documentation/img/node-complete.png)

## Deployment

To deploy this project run

```bash
  npm run deploy
```


## Used By

This project is used by the following company:

- [SMTP SERVER](https://smtpserver.com/)

