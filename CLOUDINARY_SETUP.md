# Cloudinary Image Upload Setup Guide

This guide will walk you through setting up Cloudinary image upload in your Next.js application.

## 📋 Prerequisites

- A Cloudinary account (sign up at [cloudinary.com](https://cloudinary.com))
- Node.js and npm installed
- Your Next.js project set up

## 🚀 Step-by-Step Setup

### Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a free account (includes 25GB storage and 25GB monthly bandwidth)
3. Once logged in, you'll be taken to your dashboard

### Step 2: Get Your Cloudinary Credentials

1. In your Cloudinary dashboard, you'll see your **Cloud Name** at the top
2. Click on the **Settings** icon (gear icon) in the top right
3. Go to the **Security** tab
4. You'll find:
   - **Cloud Name** (already visible in dashboard)
   - **API Key** (visible in Security tab)
   - **API Secret** (click "Reveal" to see it - keep this secret!)

### Step 3: Configure Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add the following environment variables:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Important Notes:**

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` must start with `NEXT_PUBLIC_` because it's used in client-side code
- `CLOUDINARY_API_SECRET` should NEVER be exposed to the client - it's only used in server actions
- Replace the placeholder values with your actual Cloudinary credentials

### Step 4: Install Dependencies

The Cloudinary package has already been installed. If you need to reinstall:

```bash
npm install cloudinary
```

### Step 5: Verify the Implementation

The following files have been set up:

1. **`lib/actions/cloudinary.ts`** - Server action for uploading images to Cloudinary
2. **`components/ui/file-upload.tsx`** - Updated to accept only images and single file
3. **`components/custom/CreateProject.tsx`** - Updated to upload images and display preview

### Step 6: Test the Upload

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to your project creation page
3. Click the "Add New Project" button
4. Try uploading an image:
   - Click the upload area or drag and drop an image
   - The image will automatically upload to Cloudinary
   - You'll see a preview of the uploaded image
   - The image URL will be stored in the database when you submit the form

## 📁 File Structure

```
lib/
  actions/
    cloudinary.ts          # Server action for Cloudinary uploads
    projects.ts            # Project CRUD operations (uses imageUrl)

components/
  ui/
    file-upload.tsx        # File upload component (configured for images only)
  custom/
    CreateProject.tsx      # Project creation form with image upload

app/
  _components/
    _feed/
      ProjectCard.tsx      # Displays project images (already configured)
```

## 🔧 How It Works

### Upload Flow

1. **User selects an image** in the `FileUpload` component
2. **File is validated** (must be an image: PNG, JPG, JPEG, WEBP, or SVG)
3. **File is uploaded to Cloudinary** via the `uploadImageToCloudinary` server action
4. **Cloudinary returns a secure URL** for the uploaded image
5. **URL is stored** in the form state and displayed as a preview
6. **On form submission**, the URL is saved to the database

### Server Action (`lib/actions/cloudinary.ts`)

- Converts the file to base64 format
- Uploads to Cloudinary with automatic optimization
- Returns the secure URL
- Handles errors gracefully

### File Upload Component

- Accepts only image files
- Limits to single file upload
- Shows file information while uploading
- Provides drag-and-drop functionality

### CreateProject Component

- Automatically uploads image when selected
- Shows upload progress
- Displays image preview after upload
- Validates that image is uploaded before form submission

## 🎨 Image Display

The uploaded images are automatically displayed in:

- **CreateProject**: Preview after upload
- **ProjectCard**: Full project image display (already configured)

Images are served from Cloudinary's CDN, ensuring fast loading times worldwide.

## 🔒 Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Keep API Secret secure** - only use in server-side code
3. **Use environment variables** for all sensitive data
4. **Validate file types** on both client and server side

## 🐛 Troubleshooting

### Issue: "Cloudinary configuration is missing"

- **Solution**: Make sure all three environment variables are set in `.env.local`
- Restart your development server after adding environment variables

### Issue: Upload fails

- **Solution**: Check that your Cloudinary credentials are correct
- Verify your Cloudinary account is active
- Check the browser console for error messages

### Issue: Image not displaying

- **Solution**: Check that `next.config.ts` allows remote images (already configured)
- Verify the image URL is being saved correctly in the database

### Issue: File type not accepted

- **Solution**: Only image files (PNG, JPG, JPEG, WEBP, SVG) are accepted
- Check the file extension and MIME type

## 📚 Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Next.js Image Optimization](https://nextjs.org/docs/pages/api-reference/components/image)

## ✅ Checklist

- [x] Cloudinary account created
- [x] Environment variables configured
- [x] Cloudinary package installed
- [x] Server action created
- [x] FileUpload component configured
- [x] CreateProject component updated
- [x] Image preview working
- [x] Form submission working

## 🎉 You're All Set!

Your Cloudinary integration is complete. You can now:

- Upload project images directly from your application
- Store image URLs in your database
- Display images from Cloudinary's CDN
- Benefit from automatic image optimization

If you encounter any issues, refer to the troubleshooting section above or check the Cloudinary documentation.
