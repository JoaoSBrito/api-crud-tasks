import fs from 'node:fs';
import { parse } from 'csv-parse';

const csvFilePath = './stream/tasks.csv'; 

async function importTasksFromCSVFile() {
  try {

    // Create a readable stream for reading the CSV file
    const fileStream = fs.createReadStream(csvFilePath, 'utf8');

    // Create a CSV parser with Async Iterator API
    const parser = fileStream.pipe(parse({ columns: true, skip_empty_lines: true }));

    // Iterate over the parsed CSV data
    for await (const row of parser) {
      // Process each row of data
      const { title, description } = row;

      // Make a request to the POST /tasks route using fetch
      await fetch('http:localhost:3333/tasks', {
        method: 'POST',
        body: JSON.stringify({ title, description }),
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Tasks imported successfully!');
  } catch (error) {
    console.error('Error importing tasks:', error);
  }
}

importTasksFromCSVFile();
