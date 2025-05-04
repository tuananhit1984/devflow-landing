export const codeExamples = {
    rest: {
        filename: 'todo-api.js',
        code: `import { DevFlow } from '@devflow/api';
import { db } from '@devflow/database';

// Initialize and configure API
const api = new DevFlow.API({
    name: 'todo-api',
    cors: true,
    rateLimit: { max: 100, windowMs: 60000 }
});

// Create a new todo
api.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    
    // Validate input
    if (!title) {
        return res.status(400).json({
            error: 'Title is required'
        });
    }
}

// Create record in database
const todo = await db.todos.create({
    title,
    description,
    completed: false,
    userId: req.user.id,
    createdAt: new Date()
});

return res.status(201).json(todo);
});

// List all todos for the authenticated user
api.get('/todos', async (req, res) => {
    const todos = await db.todos.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' }
    });

    return res.json(todos);
});

// One command deployment
api.deploy();`
    },
    graphql: {
        filename: 'schema.graphql',
        code: `type Todo {
    id: ID!
    title: String!
    description: String
    completed: Boolean!
    createdAt: DateTime!
    user: User!
}

type Query {
    todos: [Todo!]!
    todo(id: ID!): Todo
}

type Mutation {
    createTodo(input: CreateTodoInput!): Todo!
    updateTodo(id: ID!, input: UpdateTodoInput!): Todo!
    deleteTodo(id: ID!): Boolean!
}

input CreateTodoInput {
    title: String!
    description: String
}

input UpdateTodoInput {
    title: String
    description: String
    completed: Boolean
}`
    },
    webhooks: {
        filename: 'webhooks.js',
        code: `import { DevFlow } from '@devflow/api';

// Configure webhook endpoints
const webhooks = new DevFlow.Webhooks({
    secret: process.env.WEBHOOK_SECRET,
    path: '/webhooks'
});

// Handle todo completion events
webhooks.on('todo.completed', async (event) => {
    const { todoId, userId } = event.data;
    
    // Send notification
    await notifications.send({
        user: userId,
        message: 'Todo completed successfully!'
    });
    
    // Log the event
    console.log(\`Todo \${todoId} marked as complete\`);
});

// Handle todo assignment events
webhooks.on('todo.assigned', async (event) => {
    const { todoId, assignedTo } = event.data;
    
    // Send email notification
    await emails.send({
        to: assignedTo.email,
        template: 'todo-assigned',
        data: { todoId }
    });
});`
    },
    authentication: {
        filename: 'auth.js',
        code: `import { DevFlow } from '@devflow/api';
import { auth } from '@devflow/auth';

// Configure authentication
const api = new DevFlow.API({
    auth: {
        providers: ['github', 'google'],
        jwt: {
            secret: process.env.JWT_SECRET
        },
        roles: ['admin', 'user']
    }
});

// Protected route with role-based access
api.get('/admin/stats', auth.requireRole('admin'), async (req, res) => {
    const stats = await analytics.getSystemStats();
    return res.json(stats);
});

// OAuth callback handler
api.get('/auth/callback', auth.handleCallback(), async (req, res) => {
    const { user, token } = req.auth;
    
    // Create or update user in database
    await db.users.upsert({
        where: { email: user.email },
        create: { ...user },
        update: { lastLogin: new Date() }
    });

    return res.redirect(\`/dashboard?token=\${token}\`);
});`
    }
};
