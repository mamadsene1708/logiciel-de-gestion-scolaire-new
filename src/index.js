const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDatabase, prisma } = require('./config/db');
const { validate } = require('./middleware/validate');
const {
  idParamSchema,
  createUserSchema,
  createStudentSchema,
  updateStudentSchema,
  createClassSchema,
  updateClassSchema,
  createEnrollmentSchema,
  updateEnrollmentStatusSchema
} = require('./validators/schemas');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const asyncHandler = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'A unique constraint would be violated.' });
    }

    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Resource not found.' });
    }

    return res.status(500).json({ error: 'Internal server error.' });
  }
};

app.get('/', (req, res) => {
  res.json({ message: 'API de gestion scolaire en ligne' });
});
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

app.get('/api/users', asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  res.json(users);
}));

app.post('/api/users', validate({ body: createUserSchema }), asyncHandler(async (req, res) => {
  const { email, firstName, lastName, role } = req.body;

  const user = await prisma.user.create({
    data: { email, firstName, lastName, role }
  });

  return res.status(201).json(user);
}));

app.get('/api/students', asyncHandler(async (req, res) => {
  const students = await prisma.student.findMany({
    include: {
      enrollments: {
        include: { class: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json(students);
}));

app.get('/api/students/:id', validate({ params: idParamSchema }), asyncHandler(async (req, res) => {
  const student = await prisma.student.findUnique({
    where: { id: req.params.id },
    include: {
      enrollments: {
        include: { class: true }
      }
    }
  });

  if (!student) {
    return res.status(404).json({ error: 'Student not found.' });
  }

  return res.json(student);
}));

app.post('/api/students', validate({ body: createStudentSchema }), asyncHandler(async (req, res) => {
  const { matricule, firstName, lastName, dateOfBirth } = req.body;

  const student = await prisma.student.create({
    data: {
      matricule,
      firstName,
      lastName,
      dateOfBirth
    }
  });

  return res.status(201).json(student);
}));

app.put('/api/students/:id', validate({ params: idParamSchema, body: updateStudentSchema }), asyncHandler(async (req, res) => {
  const { matricule, firstName, lastName, dateOfBirth } = req.body;

  const student = await prisma.student.update({
    where: { id: req.params.id },
    data: {
      matricule,
      firstName,
      lastName,
      dateOfBirth
    }
  });

  return res.json(student);
}));

app.delete('/api/students/:id', validate({ params: idParamSchema }), asyncHandler(async (req, res) => {
  await prisma.student.delete({
    where: { id: req.params.id }
  });

  return res.status(204).send();
}));

app.get('/api/classes', asyncHandler(async (req, res) => {
  const classes = await prisma.class.findMany({
    include: {
      enrollments: {
        include: { student: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return res.json(classes);
}));

app.get('/api/classes/:id', validate({ params: idParamSchema }), asyncHandler(async (req, res) => {
  const classRoom = await prisma.class.findUnique({
    where: { id: req.params.id },
    include: {
      enrollments: {
        include: { student: true }
      }
    }
  });

  if (!classRoom) {
    return res.status(404).json({ error: 'Class not found.' });
  }

  return res.json(classRoom);
}));

app.post('/api/classes', validate({ body: createClassSchema }), asyncHandler(async (req, res) => {
  const { code, name, level } = req.body;

  const classRoom = await prisma.class.create({
    data: { code, name, level }
  });

  return res.status(201).json(classRoom);
}));

app.put('/api/classes/:id', validate({ params: idParamSchema, body: updateClassSchema }), asyncHandler(async (req, res) => {
  const { code, name, level } = req.body;

  const classRoom = await prisma.class.update({
    where: { id: req.params.id },
    data: { code, name, level }
  });

  return res.json(classRoom);
}));

app.delete('/api/classes/:id', validate({ params: idParamSchema }), asyncHandler(async (req, res) => {
  await prisma.class.delete({
    where: { id: req.params.id }
  });

  return res.status(204).send();
}));

app.get('/api/enrollments', asyncHandler(async (req, res) => {
  const enrollments = await prisma.enrollment.findMany({
    include: {
      student: true,
      class: true
    },
    orderBy: { enrolledAt: 'desc' }
  });

  return res.json(enrollments);
}));

app.post('/api/enrollments', validate({ body: createEnrollmentSchema }), asyncHandler(async (req, res) => {
  const { studentId, classId, status } = req.body;

  const enrollment = await prisma.enrollment.create({
    data: { studentId, classId, status },
    include: {
      student: true,
      class: true
    }
  });

  return res.status(201).json(enrollment);
}));

app.patch('/api/enrollments/:id/status', validate({ params: idParamSchema, body: updateEnrollmentStatusSchema }), asyncHandler(async (req, res) => {
  const { status } = req.body;

  const enrollment = await prisma.enrollment.update({
    where: { id: req.params.id },
    data: { status },
    include: {
      student: true,
      class: true
    }
  });

  return res.json(enrollment);
}));

app.delete('/api/enrollments/:id', validate({ params: idParamSchema }), asyncHandler(async (req, res) => {
  await prisma.enrollment.delete({
    where: { id: req.params.id }
  });

  return res.status(204).send();
}));

const startServer = async () => {
  try {
    await connectDatabase();
    console.log('Database connection established.');

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
