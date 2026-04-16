const validate = (schemas) => (req, res, next) => {
  try {
    if (schemas.params) {
      const parsedParams = schemas.params.safeParse(req.params);
      if (!parsedParams.success) {
        return res.status(400).json({
          error: 'Invalid request params.',
          details: parsedParams.error.flatten().fieldErrors
        });
      }
      req.params = parsedParams.data;
    }

    if (schemas.query) {
      const parsedQuery = schemas.query.safeParse(req.query);
      if (!parsedQuery.success) {
        return res.status(400).json({
          error: 'Invalid request query.',
          details: parsedQuery.error.flatten().fieldErrors
        });
      }
      req.query = parsedQuery.data;
    }

    if (schemas.body) {
      const parsedBody = schemas.body.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({
          error: 'Invalid request body.',
          details: parsedBody.error.flatten().fieldErrors
        });
      }
      req.body = parsedBody.data;
    }

    return next();
  } catch (error) {
    return res.status(500).json({ error: 'Validation middleware failed.' });
  }
};

module.exports = { validate };
