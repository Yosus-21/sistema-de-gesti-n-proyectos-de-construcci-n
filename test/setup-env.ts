process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
process.env.JWT_SECRET =
  process.env.JWT_SECRET ?? 'suarq-test-jwt-secret-for-e2e-suite-32chars';
process.env.AUTH_REGISTER_ENABLED = process.env.AUTH_REGISTER_ENABLED ?? 'true';
