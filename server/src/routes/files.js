const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Directory to store user files
const FILES_DIR = path.join(__dirname, '../../user_files');

// Ensure files directory exists
async function ensureFilesDir() {
  try {
    await fs.access(FILES_DIR);
  } catch (error) {
    await fs.mkdir(FILES_DIR, { recursive: true });
  }
}

// Initialize files directory
ensureFilesDir();

// Get all files
router.get('/', async (req, res) => {
  try {
    await ensureFilesDir();
    const files = await fs.readdir(FILES_DIR);
    const fileList = await Promise.all(
      files.map(async (file) => {
        const stats = await fs.stat(path.join(FILES_DIR, file));
        return {
          name: file,
          size: stats.size,
          lastModified: stats.mtime,
        };
      })
    );
    res.json(fileList);
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// Get file content
router.get('/:filename', async (req, res) => {
  try {
    const filePath = path.join(FILES_DIR, req.params.filename);
    const content = await fs.readFile(filePath, 'utf8');
    res.json({ content });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(404).json({ error: 'File not found' });
  }
});

// Save file
router.post('/:filename', async (req, res) => {
  try {
    await ensureFilesDir();
    const filePath = path.join(FILES_DIR, req.params.filename);
    await fs.writeFile(filePath, req.body.content);
    res.json({ success: true, message: 'File saved successfully' });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ error: 'Failed to save file' });
  }
});

// Delete file
router.delete('/:filename', async (req, res) => {
  try {
    const filePath = path.join(FILES_DIR, req.params.filename);
    await fs.unlink(filePath);
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router; 