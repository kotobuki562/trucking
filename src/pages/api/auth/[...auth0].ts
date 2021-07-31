/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-default-export */
import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        returnTo: '/',
      });
    } catch (error) {
      res.status(error.status || 500).end(error.message);
    }
  },
});
