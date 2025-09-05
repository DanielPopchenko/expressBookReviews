const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
	if (!req.body.username || !req.body.password) {
		return res
			.status(400)
			.json({ message: 'Username and/or password are required' });
	}
	if (!isValid(req.body.username)) {
		users.push({
			username: req.body.username,
			password: req.body.password,
		});
		return res.status(200).json({ message: 'User registered successfully' });
	}
	return res.status(400).json({ message: 'User already exists' });
});

// Get the book list available in the shop - Async/Await version
public_users.get('/', async function (req, res) {
	try {
		// Process the books data using async/await pattern
		const processedBooks = await new Promise(resolve => {
			// Simulate async processing of books data
			setTimeout(() => {
				const booksList = Object.keys(books).map(key => ({
					isbn: key,
					...books[key],
					reviewsCount: Object.keys(books[key].reviews || {}).length,
				}));
				resolve(booksList);
			}, 100); // Small delay to demonstrate async behavior
		});

		return res.status(200).json({
			books: processedBooks,
			totalBooks: processedBooks.length,
			message: 'Books retrieved successfully using async-await',
		});
	} catch (error) {
		console.error('Error fetching books:', error);
		return res.status(500).json({
			message: 'Error retrieving books',
			error: error.message,
		});
	}
});

// Alternative Promise callback version for getting books
public_users.get('/promise', function (req, res) {
	// Using Promise callbacks instead of async-await
	new Promise(resolve => {
		// Simulate async processing of books data
		setTimeout(() => {
			const booksList = Object.keys(books).map(key => ({
				isbn: key,
				...books[key],
				reviewsCount: Object.keys(books[key].reviews || {}).length,
			}));
			resolve(booksList);
		}, 100); // Small delay to demonstrate async behavior
	})
		.then(processedBooks => {
			return res.status(200).json({
				books: processedBooks,
				totalBooks: processedBooks.length,
				message: 'Books retrieved successfully using Promise callbacks',
			});
		})
		.catch(error => {
			console.error('Error fetching books:', error);
			return res.status(500).json({
				message: 'Error retrieving books',
				error: error.message,
			});
		});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
	//Write your code here

	try {
		return res.status(300).json({ book: books[req.params.isbn] });
	} catch {
		return res.status(300).json({ book: 'Book not found' });
	}
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
	console.log(req.params);
	//Write your code here
	try {
		for (let book in books) {
			if (books[book].author === req.params.author) {
				return res.status(300).json({ book: books[book] });
			}
		}
	} catch {
		return res.status(400).json({ book: 'Book not found' });
	}
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
	//Write your code here
	try {
		for (let book in books) {
			if (books[book].title === req.params.title) {
				return res.status(300).json({ book: books[book] });
			}
		}
	} catch {
		return res.status(400).json({ book: 'Book not found' });
	}
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
	//Write your code here
	return res.status(300).json({ reviews: books[req.params.isbn].reviews });
});

module.exports.general = public_users;
