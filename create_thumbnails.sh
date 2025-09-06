#!/bin/bash

echo "Creating optimized thumbnails for faster loading..."

# Create thumbnail directories
mkdir -p "images/gallery/Photos/Fall Kickoff/Thumbnails/Brothers"
mkdir -p "images/gallery/Photos/Fall Kickoff/Thumbnails/Sisters"

# Function to create thumbnails
create_thumbnails() {
    local source_dir="$1"
    local dest_dir="$2"
    local count=0
    
    echo "Processing $source_dir..."
    
    for file in "$source_dir"/*.jpg; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            
            # Skip if thumbnail already exists
            if [ ! -f "$dest_dir/$filename" ]; then
                # Create 400px max thumbnail with 70% quality
                sips -Z 400 -s format jpeg -s formatOptions 70 "$file" --out "$dest_dir/$filename" >/dev/null 2>&1
                ((count++))
                
                # Progress indicator
                if (( count % 10 == 0 )); then
                    echo "  Processed $count images..."
                fi
            fi
        fi
    done
    
    echo "  Completed: $count thumbnails created in $(basename "$dest_dir")"
}

# Create thumbnails for Brothers photos
create_thumbnails "images/gallery/Photos/Fall Kickoff/Brothers" "images/gallery/Photos/Fall Kickoff/Thumbnails/Brothers"

# Create thumbnails for Sisters photos  
create_thumbnails "images/gallery/Photos/Fall Kickoff/Sisters" "images/gallery/Photos/Fall Kickoff/Thumbnails/Sisters"

echo ""
echo "Thumbnail creation complete!"
echo "Original photos: Large file size (for downloads and lightbox)"
echo "Thumbnails: Small file size (for fast gallery loading)"

# Show size comparison
echo ""
echo "Size comparison:"
if [ -f "images/gallery/Photos/Fall Kickoff/Brothers/1-IMG_6431.jpg" ] && [ -f "images/gallery/Photos/Fall Kickoff/Thumbnails/Brothers/1-IMG_6431.jpg" ]; then
    echo "Original: $(ls -lh "images/gallery/Photos/Fall Kickoff/Brothers/1-IMG_6431.jpg" | awk '{print $5}')"
    echo "Thumbnail: $(ls -lh "images/gallery/Photos/Fall Kickoff/Thumbnails/Brothers/1-IMG_6431.jpg" | awk '{print $5}')"
fi
