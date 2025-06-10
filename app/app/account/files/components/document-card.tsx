'use client';

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DocumentCardProps {
  title: string
  description: string
  details: React.ReactNode
  previewUrl?: string
  lastUpdated: string
  onUpload: () => void
}

export function DocumentCard({
  title,
  description,
  details,
  previewUrl,
  lastUpdated,
  onUpload,
}: DocumentCardProps) {
  return (
    <div className="border bg-primary-foreground dark:bg-background rounded-lg">
      <div className="bg-background rounded-t-lg p-4 gap-4 flex flex-col">
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-sm">{description}</p>
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <div className="max-h-56 h-fit rounded-md bg-ground p-4">
            <TabsContent value="details">{details}</TabsContent>
            <TabsContent value="preview" className="grid">
              {previewUrl ? (
                <iframe className="border rounded-md w-full h-72" src={previewUrl} />
              ) : (
                <p className="text-muted-foreground text-sm">
                  No preview available.
                </p>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between items-center rounded-b-lg border-t p-4">
        <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
        <Button onClick={onUpload}>Upload</Button>
      </div>
    </div>
  )
}
