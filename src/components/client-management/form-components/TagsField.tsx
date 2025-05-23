
import React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { X, Plus } from "lucide-react";

interface TagsFieldProps {
  tags: string[];
  currentTag: string;
  setCurrentTag: (tag: string) => void;
  handleAddTag: () => void;
  handleRemoveTag: (tag: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

const TagsField = ({ 
  tags, 
  currentTag, 
  setCurrentTag, 
  handleAddTag, 
  handleRemoveTag, 
  handleKeyPress 
}: TagsFieldProps) => {
  return (
    <div className="md:col-span-2">
      <FormLabel className="text-white">Tags</FormLabel>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <Badge key={tag} variant="secondary" className="gap-1 bg-white/20 text-white">
            {tag}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => handleRemoveTag(tag)}
            />
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Add tags (e.g., commercial, personal injury)"
          value={currentTag}
          onChange={(e) => setCurrentTag(e.target.value)}
          onKeyDown={handleKeyPress}
          className="bg-white/10 text-white border-white/20"
        />
        <Button 
          type="button" 
          size="icon" 
          onClick={handleAddTag}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-white/70 mt-2">
        Press Enter or click + to add a tag
      </p>
    </div>
  );
};

export default TagsField;
