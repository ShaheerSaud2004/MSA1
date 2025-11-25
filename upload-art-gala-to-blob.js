#!/usr/bin/env node

/**
 * Upload Art Gala photos to Vercel Blob Storage
 * This script uploads all Art Gala images and generates a mapping file
 * for updating the JavaScript code to use blob URLs.
 */

import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOB_TOKEN = process.env.BLOBs_READ_WRITE_TOKEN || 'vercel_blob_rw_QYpgqoEsv0uOP8Mj_aF69etEjlZJEHB0BcEyrnx2N3RAmaw';

// Directories to upload
const DIRECTORIES = [
    {
        localPath: 'images/Art Gala | Brothers',
        blobPrefix: 'art-gala/brothers'
    },
    {
        localPath: 'images/gallery/Photos/Art Gala | Sisters',
        blobPrefix: 'art-gala/sisters'
    }
];

// Store mapping of local paths to blob URLs
const urlMapping = {
    brothers: {},
    sisters: {}
};

async function uploadDirectory(localPath, blobPrefix, albumType) {
    if (!fs.existsSync(localPath)) {
        console.log(`⚠️  Directory not found: ${localPath}`);
        return;
    }

    const files = fs.readdirSync(localPath)
        .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
        .sort();

    console.log(`\n📤 Uploading ${files.length} files from ${localPath}...`);

    let uploaded = 0;
    let failed = 0;

    for (const file of files) {
        const filePath = path.join(localPath, file);
        const blobPath = `${blobPrefix}/${file}`;

        try {
            const fileBuffer = fs.readFileSync(filePath);
            const { url } = await put(blobPath, fileBuffer, {
                access: 'public',
                token: BLOB_TOKEN
            });

            // Store mapping: local path -> blob URL
            const localRelativePath = localPath.replace(/^images\//, 'images/');
            const localFullPath = `${localRelativePath}/${file}`;
            urlMapping[albumType][localFullPath] = url;

            uploaded++;
            if (uploaded % 50 === 0) {
                console.log(`  ✓ Uploaded ${uploaded}/${files.length}...`);
            }
        } catch (error) {
            console.error(`  ✗ Failed to upload ${file}:`, error.message);
            failed++;
        }
    }

    console.log(`\n✅ ${uploaded} files uploaded, ${failed} failed`);
    return { uploaded, failed };
}

async function main() {
    console.log('🚀 Starting Art Gala photo upload to Vercel Blob Storage...\n');

    // Upload Brothers photos
    await uploadDirectory(
        DIRECTORIES[0].localPath,
        DIRECTORIES[0].blobPrefix,
        'brothers'
    );

    // Upload Sisters photos
    await uploadDirectory(
        DIRECTORIES[1].localPath,
        DIRECTORIES[1].blobPrefix,
        'sisters'
    );

    // Save URL mapping to file
    const mappingFile = 'art-gala-blob-urls.json';
    fs.writeFileSync(mappingFile, JSON.stringify(urlMapping, null, 2));
    console.log(`\n💾 URL mapping saved to ${mappingFile}`);

    console.log('\n✨ Upload complete!');
    console.log('\nNext steps:');
    console.log('1. Review the URL mapping in art-gala-blob-urls.json');
    console.log('2. Update js/script.js to use blob URLs instead of local paths');
    console.log('3. Commit and push the changes');
}

main().catch(console.error);

