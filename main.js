// Required Node.js modules
const WebSocket = require('ws');
const http = require('http');
const fs = require('fs'); // Import the base fs module for createWriteStream
const fsp = fs.promises; // Create a separate reference for promise-based functions
const path = require('path');
const FormData = require('form-data');
const { v4: uuidv4 } = require('uuid');

// Server details and client ID
const serverAddress = '127.0.0.1:8188';
const clientId = uuidv4(); // Replace with actual client ID or use a UUID generator


// Read workflow API data from file and convert it into an object
// Use fsp for promise-based readFile
async function readWorkflowAPI() {
    const data = await fsp.readFile(path.join(__dirname, 'workflow_api.json'), 'utf8');
    return JSON.parse(data);
}


// Function to upload an image
async function uploadImage(filePath) {
  // Create a new FormData instance
  const formData = new FormData();
  
  // Append the file. The 'image' field corresponds to the name expected by the server.
  formData.append('image', fs.createReadStream(filePath));

  const options = {
    hostname: '127.0.0.1',
    port: 8188,
    path: '/upload/image',
    method: 'POST',
    headers: formData.getHeaders() // Automatically sets the correct multipart header
  };

  return new Promise((resolve, reject) => {
    // Make the request to the server
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve(JSON.parse(data)); // The server should respond with some form of JSON
      });
    });

    req.on('error', (e) => reject(e));
    
    // Pipe the form data into the request
    formData.pipe(req);
  });
}

// Function to queue prompt
async function queuePrompt(promptWorkflow) {
    const postData = JSON.stringify({ prompt: promptWorkflow, client_id: clientId });
    const options = {
        hostname: '127.0.0.1',
        port: 8188,
        path: '/prompt',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                resolve(JSON.parse(data).prompt_id);
            });
        });
        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
    });
}

// Function to get prompt history
async function getHistory(promptId) {
  return new Promise((resolve, reject) => {
    http.get(`http://${serverAddress}/history/${promptId}`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to download images
async function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filename);
        http.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(filename, () => reject(err)); // Use the callback version of unlink
        });
    });
}


// WebSocket connection
const ws = new WebSocket(`ws://${serverAddress}/ws?clientId=${clientId}`);

ws.on('open', () => {
    console.log('WebSocket connection established');
});

ws.on('message', async (data) => {
    // Convert Buffer to string
    const messageString = data.toString();
    console.log('WebSocket message received:', messageString); // For debugging

    // Parse the string as JSON
    const message = JSON.parse(messageString);

    if (message.type === 'executed' && message.data.prompt_id === promptId) {
        console.log('Execution completed for prompt ID:', message.data.prompt_id); // For debugging

        // Directly access the images from the message
        const images = message.data.output.images;
        console.log('Images:', images); // Add for debugging

        for (const image of images) {
    
            const imageUrl = `http://${serverAddress}/view?filename=${encodeURIComponent(image.filename)}&subfolder=${encodeURIComponent(image.subfolder)}&type=${encodeURIComponent(image.type)}`;
            console.log('Downloading image from:', imageUrl); // Add for debugging
            const filename = path.join(__dirname, 'imagenes', image.filename);
            await downloadImage(imageUrl, filename);
            console.log(`Downloaded image: ${filename}`);
        }
    }
});


// Main function to run the script
async function main() {
    const promptWorkflow = await readWorkflowAPI();
    
    promptWorkflow["3"]["inputs"]["seed"] = Math.floor(Math.random() * 18446744073709551614) + 1;
    const emptyLatentImgNode = promptWorkflow["5"];
    emptyLatentImgNode["inputs"]["batch_size"] = 4;
    
    //Si quieres subir imagenes, este es un ejemplo
    //const uploadResponse = await uploadImage("imagen.png");
    
    
    //promptWorkflow["31"]["inputs"]["image"] = uploadResponse.name;
    //promptId = await queuePrompt(promptWorkflow);

    console.log(`Queued prompt with ID: ${promptId}`);

}

// Run the main function
main().catch(console.error);
