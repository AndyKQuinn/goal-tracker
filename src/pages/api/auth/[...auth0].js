import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';

const afterCallback = (
  req,
  res,
  session,
  state
) => {
  // if (!session.user.isAdmin) {
  //   // throw new UnauthorizedError('User is not admin');
  // }
  return session;
};

export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback });
    } catch (error) {
      res.status(error.status || 500).end(error.message);
    }
  }
});
