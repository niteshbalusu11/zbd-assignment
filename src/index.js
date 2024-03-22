import Fastify from 'fastify';
import fastifyMetrics from 'fastify-metrics';

const app = Fastify();

// Return some metrics for simulation
app.register(fastifyMetrics, {
	endpoint: '/metrics',
	metrics: {
		histogram: {
			name: 'http_request_duration_seconds',
			help: 'HTTP request duration in seconds',
			buckets: [0.1, 0.5, 1, 2, 5],
		},
	},
});


app.get('/', (request, reply) => {
	reply.send({ message: "yo" })
});

app.get('/health', (request, reply) => {
	reply.send({ status: 'OK', message: "I'm healthy" });
});


app.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
