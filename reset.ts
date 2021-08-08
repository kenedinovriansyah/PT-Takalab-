import path from 'path';
import fs from 'fs';

fs.writeFileSync(
  path.join(__dirname, 'server/__tests__/requirements.txt'),
  JSON.stringify({
    count: 0,
    token: null,
    category: 0,
    product: 0,
  })
);

fs.rm(path.join(__dirname, 'database.sqlite'), () => {
  console.log('database has been deleted');
});

fs.createWriteStream(path.join(__dirname, 'database.sqlite'));
