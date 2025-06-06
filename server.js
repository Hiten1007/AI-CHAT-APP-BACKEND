// index.js
import createApp from './createApp.js';

const app = createApp();
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;
