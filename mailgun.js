import formData from 'form-data'
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
	username: 'api',
	key: 'aba6b478bb7e8433efccf58efdaff83d-e5475b88-6969f506',
});
mg.messages
	.create('sandboxe291e53a96a4498eae13cc9571c31d3c.mailgun.org', {
		from: "Mailgun Sandbox <postmaster@sandboxe291e53a96a4498eae13cc9571c31d3c.mailgun.org>",
		to: ["idasiadiachi@gmail.com"],
		subject: "Hello",
		text: "Testing some Mailgun awesomness!",
	})
	.then(msg => console.log(msg)) // logs response data
	.catch(err => console.log(err)); // logs any error`;


// You can see a record of this email in your logs: https://app.mailgun.com/app/logs.

// You can send up to 300 emails/day from this sandbox server.
// Next, you should add your own domain so you can send 10000 emails/month for free.