import fs from 'fs';
import path from 'path';

const file = path.resolve('src/data/programacion-2026.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const updatedData = data.map(event => {
  if (event.id !== 'pablo-sainz-villegas-2026' && event.id !== 'niklas-liepe-2026') {
    return { ...event, hidden: true };
  }
  return event;
});

fs.writeFileSync(file, JSON.stringify(updatedData, null, 2));
console.log('Updated JSON with hidden flags');
