import Fastify from 'fastify';
import client from 'prom-client';

const app = Fastify({ logger: true });

// Create a Registry to register the metrics
const register = new client.Registry();
register.setDefaultLabels({ app: 'zbd' })


client.collectDefaultMetrics({ register })

// Create a histogram metric
const httpRequestDurationMicroseconds = new client.Histogram({
	name: 'http_request_duration_seconds',
	help: 'Duration of HTTP requests in microseconds',
	labelNames: ['method', 'route', 'code'],
	buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
})

// Middleware to record the duration of each request
app.addHook('onRequest', (request, reply, done) => {
	console.log('this is getting called')
	const end = httpRequestDurationMicroseconds.startTimer();

	end({ route: request.routerPath, code: reply.statusCode, method: request.method });
	done()
});


// Default route
app.get('/', (request, reply) => {
	reply.status(200).send({ message: "yo" })
})

// Health endpoint
app.get('/health', (request, reply) => {
	reply.status(200).send({ status: 'OK', message: "I'm healthy" });
});

// Metrics endpoint
app.get('/metrics', async (request, reply) => {
	reply.header('Content-Type', register.contentType);
	reply.send(await register.metrics());
});

// Start the server
app.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
	if (!!err) {
		app.log.error(err)
		process.exit()
	}
	console.log(`Server is running on port ${address}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
	app.close()
	process.exit(0)
})
