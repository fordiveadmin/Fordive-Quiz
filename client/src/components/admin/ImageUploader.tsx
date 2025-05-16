import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImageUrl?: string;
}

export function ImageUploader({ onImageUploaded, currentImageUrl }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(currentImageUrl || null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, GIF, WebP)",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      const imageUrl = data.filePath;
      
      // Show preview
      setImagePreview(imageUrl);
      
      // Call callback with image URL
      onImageUploaded(imageUrl);
      
      toast({
        title: "Upload successful",
        description: "Image has been uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image",
        variant: "destructive",
      });
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept="image/jpeg, image/png, image/gif, image/webp"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
        
        {isUploading ? (
          <Button disabled variant="outline">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </Button>
        ) : (
          <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        )}
      </div>
      
      {imagePreview && (
        <div className="border rounded-md p-2 max-w-[200px]">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="max-h-[150px] object-contain mx-auto"
          />
        </div>
      )}
      
      {!imagePreview && currentImageUrl && (
        <div className="border rounded-md p-2 max-w-[200px]">
          <img 
            src={currentImageUrl} 
            alt="Current Image" 
            className="max-h-[150px] object-contain mx-auto"
          />
        </div>
      )}
      
      {!imagePreview && !currentImageUrl && (
        <div className="border rounded-md p-4 flex items-center justify-center bg-muted max-w-[200px]">
          <ImageIcon className="h-10 w-10 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}