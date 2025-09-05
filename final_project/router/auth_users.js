const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = username => {
	//returns boolean
	//write code to check is the username is valid
	return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
	//returns boolean
	//write code to check if username and password match the one we have in records.
	return users.some(
		user => user.username === username && user.password === password
	);
};

//only registered users can login
regd_users.post('/login', (req, res) => {
	console.log(req.body);
	const username = req.body.username;
	const password = req.body.password;

	// Check if username or password is missing
	if (!username || !password) {
		return res.status(404).json({ message: 'Error logging in' });
	}

	// Authenticate user
	if (authenticatedUser(username, password)) {
		// Generate JWT access token
		let accessToken = jwt.sign(
			{
				data: username,
			},
			'access',
			{ expiresIn: 60 * 60 }
		);

		// Store access token and username in session
		req.session.authorization = {
			accessToken,
			username,
		};
		return res.status(200).send('User successfully logged in');
	} else {
		return res
			.status(208)
			.json({ message: 'Invalid Login. Check username and password' });
	}
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
	console.log(req.body);
	if (!req.body.review) {
		return res.status(400).json({ message: 'Review is required' });
	}

	const isbn = req.params.isbn;
	const username = req.user.data; // This is the username from the JWT token (set by index.js middleware)

	// Check if the book exists
	if (!books[isbn]) {
		return res.status(404).json({ message: 'Book not found' });
	}

	// Initialize reviews object if it doesn't exist
	if (!books[isbn].reviews) {
		books[isbn].reviews = {};
	}

	// Add or update the review for this user
	books[isbn].reviews[username] = req.body.review;

	return res.status(200).json({ message: 'Review added successfully' });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
	const isbn = req.params.isbn;
	const username = req.user.data; // This is the username from the JWT token (set by index.js middleware)
	delete books[isbn].reviews[username];
	return res.status(200).json({ message: 'Review deleted successfully' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
