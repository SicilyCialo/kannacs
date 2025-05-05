# Custom Background Setup

This application supports different types of backgrounds:

1. **Video Background** (MP4 format)
2. **Image Background** (JPG, PNG, WebP formats)
3. **Animated Background** (built-in pixel art animation)

## How to Add a Custom Video Background

1. Create an MP4 video file with the following specifications:
   - Resolution: 1920x1080 (Full HD) or 1280x720 (HD) recommended
   - Duration: 15-30 seconds loop recommended
   - File size: Keep under 5MB for optimal performance
   - Format: MP4 using H.264 codec for maximum compatibility

2. Name your video file `background.mp4` and place it in the `public` folder.

3. Also add a fallback image named `background-fallback.jpg` for browsers that don't support video playback.

## How to Add a Custom Image Background

1. Create an image file with the following specifications:
   - Resolution: 1920x1080 or larger
   - Format: JPG, PNG or WebP (WebP recommended for better compression)
   - File size: Keep under 1MB for optimal performance

2. Name your image file `background.jpg` (or .png/.webp) and place it in the `public` folder.

## Switching Between Background Types

The application includes buttons in the top-right corner that allow you to switch between the different background types:
- Video: Uses your custom MP4 video
- Image: Uses your custom background image
- Animated: Uses the built-in pixel art animation

## Performance Considerations

- Videos will use more resources than static images
- For mobile devices, the application may automatically fall back to the image
- If your video is stuttering, try reducing its resolution or bitrate 