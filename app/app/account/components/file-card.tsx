"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsMobile } from "@/hooks/use-mobile"

export type FileCardProps = {
  label: string
  description?: string
  fileUrl?: string | null
  fileMetadata?: {
    _creationTime?: number
    contentType?: string
    size?: number
  } | null
  onUpload: (file: File) => Promise<void>
}

export function FileCard({ label, description, fileUrl, fileMetadata, onUpload }: FileCardProps) {
  const isMobile = useIsMobile()
  const fileInput = React.useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null)

  async function handleUpload(file: File) {
    setUploadProgress(0)

    const fakeUpload = async () => {
      // Optional: Replace this with real upload logic w/ progress if needed
      await onUpload(file)
      setSelectedFile(null)
      setUploadProgress(null)
      if (fileInput.current) fileInput.current.value = ""
    }

    await fakeUpload()
  }

  return (
    <div className="rounded-lg border bg-background p-4 space-y-4">
      <div>
        <h3 className="font-medium text-lg">{label}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="preview" disabled={isMobile}>Preview</TabsTrigger>
        </TabsList>
        <div className="h-fit rounded-md bg-muted/5 dark:bg-muted/10">
          <TabsContent value="preview" className="grid">
            <div className="grid h-[400px] relative">
              {fileUrl ? (
                <iframe src={fileUrl} className="rounded-md w-full h-full border" />
              ) : (
                <p className="p-4 grid place-items-center text-muted-foreground">
                  No preview available
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="details" className="p-4 grid gap-2 text-sm">
            <div className="flex gap-4">
              <div className="min-w-24 text-muted-foreground">Last updated</div>
              {fileMetadata?._creationTime ? (
                <p className="text-primary">
                  {new Date(fileMetadata._creationTime).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              ) : (
                <>-</>
              )}
            </div>
            <div className="flex gap-4">
              <div className="min-w-24 text-muted-foreground">File type</div>
              {fileMetadata?.contentType ? (
                <p className="text-primary">{fileMetadata.contentType.split("/")[1]}</p>
              ) : (
                "-"
              )}
            </div>
            <div className="flex gap-4">
              <div className="min-w-24 text-muted-foreground">Size</div>
              {fileMetadata?.size ? (
                <p className="text-primary">{(fileMetadata.size / 1024).toFixed(1)} KB</p>
              ) : (
                "-"
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <form className="flex grow justify-end items-center gap-2">
        <input
          hidden
          type="file"
          accept="application/pdf"
          ref={fileInput}
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) setSelectedFile(file)
          }}
        />

        {uploadProgress !== null ? (
          <div className="w-full h-2 bg-muted rounded-md overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        ) : (
          <div className="flex flex-wrap items-center w-full justify-end gap-2">
            {selectedFile && (
              <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                <span className="font-medium mr-2">Selected:</span>{selectedFile.name}
              </p>
            )}
            {selectedFile ? (
              <>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleUpload(selectedFile)}
                >
                  Upload
                </Button>
                <Button
                  type="reset"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedFile(null)
                    if (fileInput.current) fileInput.current.value = ""
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={() => fileInput.current?.click()}
              >
                Choose file
              </Button>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
