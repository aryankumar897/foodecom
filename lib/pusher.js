
import Pusher from 'pusher';

export const pusherServer = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: process.env.CLUSTER,
  useTLS: true,
});

// export const pusherClient = new Pusher(process.env.KEY, {
//   cluster: process.env.CLUSTER,
//   forceTLS: true,
// });