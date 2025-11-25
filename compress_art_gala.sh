#!/bin/bash

echo "Compressing Art Gala photos for GitHub upload..."
echo "This will resize images to max 2000px width and compress to 85% quality"
echo ""

# Function to compress images
compress_images() {
    local source_dir="$1"
    local temp_dir="${source_dir}_compressed_temp"
    local count=0
    local total=$(find "$source_dir" -type f \( -name "*.jpg" -o -name "*.jpeg" \) | wc -l | tr -d ' ')
    
    echo "Processing $(basename "$source_dir")... ($total images)"
    mkdir -p "$temp_dir"
    
    find "$source_dir" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.JPG" -o -name "*.JPEG" \) | while read -r file; do
        filename=$(basename "$file")
        temp_file="$temp_dir/$filename"
        
        # Compress: max width 2000px, 85% quality
        sips -Z 2000 -s format jpeg -s formatOptions 85 "$file" --out "$temp_file" >/dev/null 2>&1
        
        if [ -f "$temp_file" ]; then
            # Replace original with compressed version
            mv "$temp_file" "$file"
            ((count++))
            
            # Progress indicator
            if (( count % 50 == 0 )); then
                echo "  Compressed $count/$total images..."
            fi
        fi
    done
    
    rmdir "$temp_dir" 2>/dev/null
    echo "  ✓ Completed: $count images compressed in $(basename "$source_dir")"
}

# Compress Brothers photos
if [ -d "images/Art Gala | Brothers" ]; then
    compress_images "images/Art Gala | Brothers"
fi

# Compress Sisters photos
if [ -d "images/gallery/Photos/Art Gala | Sisters" ]; then
    compress_images "images/gallery/Photos/Art Gala | Sisters"
fi

echo ""
echo "Compression complete!"
echo ""
echo "Checking new sizes..."
du -sh "images/Art Gala | Brothers" "images/gallery/Photos/Art Gala | Sisters" 2>/dev/null

