// src/webviews/Sidebar.tsx
import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function Sidebar() {
  const [useCustomPath, setUseCustomPath] = useState(false);
  const [customPath, setCustomPath] = useState('');
  const [imageFormat, setImageFormat] = useState<'png' | 'jpg'>('png');

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Paste Image Settings</h2>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="customPath"
            checked={useCustomPath}
            onCheckedChange={(checked) => setUseCustomPath(Boolean(checked))}
          />
          <label htmlFor="customPath" className="text-sm font-medium">
            Use Custom Path
          </label>
        </div>
        <Input
          placeholder="Enter path (e.g. images/screenshots)"
          disabled={!useCustomPath}
          value={customPath}
          onChange={(e) => setCustomPath((e.target as HTMLInputElement).value)}
        />
      </div>

      {/* Accordion may require alternative prop if shadcn/ui version does not support `type`/`collapsible` */}
      <Accordion defaultValue="format">
        <AccordionItem value="format">
          <AccordionTrigger>Select Image Format</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="imageFormat"
                  value="png"
                  checked={imageFormat === 'png'}
                  onChange={() => setImageFormat('png')}
                />
                <span>PNG</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="imageFormat"
                  value="jpg"
                  checked={imageFormat === 'jpg'}
                  onChange={() => setImageFormat('jpg')}
                />
                <span>JPG</span>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
