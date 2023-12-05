// Import required modules
const fs = require('fs');
const path = require('path');

// Function to recursively traverse directories starting from a given path
function fromDir(startPath, filter, callback) {
	// Check if the startPath exists
	if (!fs.existsSync(startPath)) {
		console.log("No directory: ", startPath);
		return;
	}

	// Read all files in the directory
	const files = fs.readdirSync(startPath);
	for (let i = 0; i < files.length; i++) {
		// Construct the full file path
		const filename = path.join(startPath, files[i]);
		// Get file stats
		const stat = fs.lstatSync(filename);
		// If it's a directory, recursively traverse
		if (stat.isDirectory()) {
			fromDir(filename, filter, callback);
		} else if (filename.indexOf(filter) >= 0) {
			// If the file matches the filter, apply the callback function
			callback(filename);
		}
	}
}

// Function to update file paths in the file
function update(filePath) {
	// Count the number of '/' in the filePath
	let count = (filePath.match(/\//g) || []).length - 1;
	let replacement = "";

	// If the file is directly under the build directory, replace '@/` with './'
	if (count === 1) {
		replacement = "./";
	} else {
		// For files in subdirectories, replace '@/` with '../' for each additional directory level
		for (let i = 0; i < count; i++) {
			replacement += "../";
		}
	}

	// Read the file
	let js = fs.readFileSync(filePath, "utf8");
	// Replace '@/` with the appropriate replacement
	js = js.replace(/@\//g, replacement);
	// Write the updated content back to the file
	fs.writeFileSync(filePath, js);
}

// Apply the update function to all .js and .d.ts files in the build directory
fromDir('./build', '.js', update);
fromDir('./build', '.d.ts', update);