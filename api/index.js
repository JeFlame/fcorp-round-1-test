const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const bcrypt = require('fastify-bcrypt');
const cookie = require('@fastify/cookie');
const { Client } = require('@elastic/elasticsearch');

const client = new Client({
    node: 'https://fcorp-round-1-test.es.asia-southeast1.gcp.elastic-cloud.com',
    auth: {
        apiKey: {
            id: 'piL2gIkBVqEvhkuViGFN',
            api_key: 'now5bOJRREK7n85oRIx4Hw',
        }
    }
});

fastify.register(bcrypt, {
    saltWorkFactor: 12
});

fastify.register(cookie, {
    secret: "my-secret",
    hook: 'onRequest',
    parseOptions: {}
});

fastify.register(cors, {
    credentials: true,
    origin: 'http://localhost:5173'
});

fastify.get('/', function handler(request, reply) {
    reply.send({ ok: true });
});

// Use this API to create index
fastify.get('/indices/create/:index', async function handler(request, reply) {
    const { index } = request.params;
    await client.indices.create({ index });
    reply.send({ ok: true });
});

fastify.post('/register', async function handler(request, reply) {
    try {
        const { username, password } = request.body;
        if (username && password) {
            const hash = await fastify.bcrypt.hash(password);
            const registerRes = await client.index({
                index: 'users',
                document: {
                    username,
                    password: hash
                }
            });
            reply.status(201).send({ message: 'Register successful', res: registerRes });
        } else {
            reply.status(400).send({ message: 'Register failed', error: 'Missing required datas' });
        }
    } catch (error) {
        this.log.error(error);
        reply.status(422).send({ message: 'Register failed', error });
    }
});

fastify.post('/login', async function handler(request, reply) {
    try {
        const { username, password } = request.body;
        if (username && password) {
            const userDocResponse = await client.search({
                index: 'users',
                query: {
                    match: {
                        username
                    }
                }
            });
            if (userDocResponse.hits.hits) {
                const userDocResponsePassword = userDocResponse.hits.hits[0]._source.password;
                const loginStatus = await fastify.bcrypt.compare(password, userDocResponsePassword);
                if (loginStatus) {
                    reply.setCookie('userDocId', userDocResponse.hits.hits[0]._id).send({ message: 'Login successful', loginStatus, user: userDocResponse.hits.hits[0]._source });
                } else {
                    reply.send({ message: `Login failed, password don't match`, loginStatus });
                }
            };
        } else {
            reply.status(400).send({ message: 'Login failed', error: 'Missing required datas' });
        }
    } catch (error) {
        this.log.error(error);
        reply.status(422).send({ message: 'Login failed', error });
    }
});

fastify.post('/logout', function handler(request, reply) {
    reply.clearCookie('userDocId').send({ message: 'Logout successful' });
});

fastify.get('/profile', async function handler(request, reply) {
    const { userDocId } = request.cookies;
    const userDocResponse = await client.get({
        index: 'users',
        id: userDocId
    });
    const userDoc = userDocResponse._source;
    reply.send({ message: 'Read user successful', user: userDoc });
});

fastify.get('/books', async function handler(request, reply) {
    try {
        const bookDocsResponse = await client.search({
            index: 'books',
            query: {
                match_all: {}
            }
        });
        if (bookDocsResponse.hits.total.value > 0) {
            const bookDocs = bookDocsResponse.hits.hits.map(item => item._source);
            reply.send({ message: 'Read books successful', items: bookDocs });
        } else {
            reply.send({ message: 'Read books successful', items: [] });
        }
    } catch (error) {
        this.log.error(error);
        reply.status(500).send({ message: 'Read books failed', error });
    }
});

fastify.get('/books/:id', async function handler(request, reply) {
    try {
        const { id } = request.params;
        const bookDocResponse = await client.search({
            index: 'books',
            query: {
                match: {
                    id
                }
            }
        });
        const bookDoc = bookDocResponse.hits.hits[0]._source;
        reply.send({ message: 'Read book successful', item: bookDoc });
    } catch (error) {
        this.log.error(error);
        reply.status(500).send({ message: 'Read book failed', error });
    }
});

fastify.post('/books', async function handler(request, reply) {
    try {
        const { id, title, author, publishedDate, description, price } = request.body;

        if (id && title && author && publishedDate && description && price) {
            const bookDocResponse = await client.index({
                index: 'books',
                document: {
                    id,
                    title,
                    author,
                    publishedDate,
                    description,
                    price
                }
            });
            reply.status(201).send({ message: 'Create book successful', data: bookDocResponse });
        } else {
            reply.status(400).send({ message: 'Create book failed', error: 'Missing required datas' });
        }
    } catch (error) {
        this.log.error(error);
        reply.status(500).send({ message: 'Create book failed', error });
    }
});

fastify.put('/books/:id', async function handler(request, reply) {
    try {
        const { id } = request.params;
        const { title, author, publishedDate, description, price } = request.body;

        if (title && author && publishedDate && description && price) {
            const bookDoc = await client.search({
                index: 'books',
                query: {
                    match: {
                        id
                    }
                }
            });
            const updatedBookDoc = await client.update({
                index: 'books',
                id: bookDoc.hits.hits[0]._id,
                doc: {
                    title,
                    author,
                    publishedDate,
                    description,
                    price
                }
            });
            reply.send({ message: 'Update book successful', data: updatedBookDoc });
        } else {
            reply.status(400).send({ message: 'Update book failed', error: 'Missing required datas' });
        }
    } catch (error) {
        this.log.error(error);
        reply.status(500).send({ message: 'Update book failed', error });
    }
});

fastify.delete('/books', async function handler(request, reply) {
    try {
        await client.deleteByQuery({
            index: 'books',
            body: {
                query: {
                    match_all: {}
                }
            }
        });
        reply.send({ message: 'Delete books successful', ok: true });
    } catch (error) {
        this.log.error(error);
        reply.status(500).send({ message: 'Delete books failed', ok: false });
    }
});

fastify.delete('/books/:id', async function handler(request, reply) {
    try {
        const { id } = request.params;
        await client.deleteByQuery({
            index: 'books',
            body: {
                query: {
                    match: {
                        id: id
                    }
                }
            }
        });
        reply.send({ message: 'Delete book successful', ok: true });
    } catch (error) {
        this.log.error(error);
        reply.status(500).send({ message: 'Delete book failed', ok: false });
    }
});

fastify.get('/comments', async function handler(request, reply) {
    try {
        const { bookId } = request.query;
        const commentDocResponse = await client.search({
            index: 'comments',
            query: {
                match: {
                    bookId
                }
            }
        });
        const commentDocs = commentDocResponse.hits.hits.map(item => item._source);
        for (let i = 0; i < commentDocs.length; i++) {
            const userDocResponse = await client.get({
                index: 'users',
                id: commentDocs[i].userDocId
            });
            commentDocs[i].username = userDocResponse._source.username;
        }
        reply.send({ message: 'Read comments successful', items: commentDocs });
    } catch (error) {
        this.log.error(error);
        reply.status(500).send({ message: 'Read comments failed', error });
    }
});

fastify.post('/comments', async function handler(request, reply) {
    try {
        const { bookId, content } = request.body;
        const { userDocId } = request.cookies;
        if (bookId && content) {
            const commentDocResponse = await client.index({
                index: 'comments',
                document: {
                    userDocId,
                    bookId,
                    content,
                    createdAt: new Date()
                }
            });
            reply.status(201).send({ message: 'Create comment successful', data: commentDocResponse });
        } else {
            reply.status(400).send({ message: 'Create comment failed', error: 'Missing required datas' });
        }
    } catch (error) {
        this.log.error(error);
        reply.status(500).send({ message: 'Create comment failed', error });
    }
});

// Use this API to delete index
fastify.get('/indices/delete/:index', async function handler(request, reply) {
    const { index } = request.params;
    await client.indices.delete({ index });
    reply.send({ ok: true });
});

fastify.listen({ port: 5000 }, (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
});
