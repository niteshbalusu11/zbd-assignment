import Fastify from 'fastify';
import fastifyMetrics from 'fastify-metrics';

const app = Fastify();

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

let customMetricValue = 0;

// Health endpoint
app.get('/health', (request, reply) => {
	reply.send({ status: 'OK', message: "I'm healthy" });
});

app.get('/trigger', (request, reply) => {
	// Simulate some work or processing
	const delay = Math.random() * 1000;
	setTimeout(() => {
		customMetricValue++;
		reply.send({ message: 'Triggered custom metric' });
	}, delay);
});

app.get('/custom-metric', (request, reply) => {
	reply.send({ customMetricValue });
});

app.listen({ port: 3000 }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
