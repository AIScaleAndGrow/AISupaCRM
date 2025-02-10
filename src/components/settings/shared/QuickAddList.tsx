import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, X } from "lucide-react";
import { useState } from "react";

interface QuickAddListProps {
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
  placeholder?: string;
  maxHeight?: string;
}

export function QuickAddList({
  items,
  onAdd,
  onRemove,
  placeholder = "Add new item...",
  maxHeight = "300px",
}: QuickAddListProps) {
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd(newItem.trim());
      setNewItem("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button onClick={handleAdd} size="icon">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className={`w-full rounded-md border`} style={{ maxHeight }}>
        <div className="p-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="group flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted"
            >
              <span>{item}</span>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100"
                onClick={() => onRemove(item)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
