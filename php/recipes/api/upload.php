<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

if (!isset($_FILES['image'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No image file uploaded']);
    exit;
}

$file = $_FILES['image'];
$fileName = $file['name'];
$fileTmpName = $file['tmp_name'];
$fileError = $file['error'];

// Define the upload directory path for storage
$uploadDir = 'C:/Users/User/OneDrive/Documents/GitHub/serverside-assignment/public/images/recipes/';

// Generate a unique filename to prevent overwriting
// Extract filename and extension
$fileInfo = pathinfo($fileName);
$filenameWithoutExt = $fileInfo['filename'];
$extension = isset($fileInfo['extension']) ? '.' . $fileInfo['extension'] : '';

// Function to generate a unique filename in the format filename_[id].extension
function generateUniqueFilename($baseName, $extension, $uploadDir) {
    $counter = 1;
    $newFilename = $baseName . '_' . $counter . $extension;

    // Check if file exists and increment counter until we find a unique name
    while (file_exists($uploadDir . $newFilename)) {
        $counter++;
        $newFilename = $baseName . '_' . $counter . $extension;
    }

    return $newFilename;
}

$uniqueFileName = generateUniqueFilename($filenameWithoutExt, $extension, $uploadDir);

// Create directory if it doesn't exist
if (!file_exists($uploadDir)) {
    if (!mkdir($uploadDir, 0777, true)) {
        error_log("Failed to create directory: " . $uploadDir);
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create upload directory']);
        exit;
    }
    // Ensure the directory has the correct permissions
    chmod($uploadDir, 0777);
}

// Check for upload errors
if ($fileError !== UPLOAD_ERR_OK) {
    http_response_code(500);
    echo json_encode(['error' => 'File upload failed']);
    exit;
}

// Validate file type
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$fileType = mime_content_type($fileTmpName);
if (!in_array($fileType, $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.']);
    exit;
}

// Move the uploaded file to the destination
if (move_uploaded_file($fileTmpName, $uploadDir . $uniqueFileName)) {
    // Return the URL path that will be accessible from the frontend
    // This path should be relative to your Next.js public directory
    $relativePath = '/images/recipes/' . $uniqueFileName;
    echo json_encode([
        'status' => 'success',
        'path' => $relativePath
    ]);
} else {
    error_log("Failed to move uploaded file. Upload dir: " . $uploadDir . ", File: " . $uniqueFileName);
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save the file']);
}