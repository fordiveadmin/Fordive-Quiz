import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ImageUploadFieldProps {
  label: string;
  currentImageUrl?: string;
  onChange: (imageUrl: string) => void;
  onClear: () => void;
}

export function ImageUploadField({ 
  label, 
  currentImageUrl, 
  onChange, 
  onClear 
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size
    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
      toast({
        title: "Invalid file type",
        description: "Only JPEG, PNG, GIF and WebP images are supported",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Create form data for upload
      const formData = new FormData();
      formData.append('image', file);
      
      // Upload the image
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Image upload failed');
      }
      
      const data = await response.json();
      
      // Update the preview and call the onChange handler
      setPreviewUrl(data.filePath);
      onChange(data.filePath);
      
      toast({
        title: "Image uploaded",
        description: "Image has been uploaded successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading the image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleClear = () => {
    setPreviewUrl(null);
    onClear();
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="image-upload">{label}</Label>
      
      <div className="flex flex-col space-y-3">
        {previewUrl ? (
          <div className="relative">
            <div className="border rounded-md overflow-hidden">
              <img 
                src={previewUrl} 
                alt="Image preview" 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/400x300?text=Image+Not+Found';
                }}
              />
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              className="absolute top-2 right-2 rounded-full bg-white"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex items-center">
              <Input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                disabled={isUploading}
                className="flex-1"
              />
              {isUploading && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Only JPEG, PNG, GIF and WebP images up to 5MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}