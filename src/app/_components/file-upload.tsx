import { useDropzone } from "react-dropzone";
import React, { ChangeEventHandler, FC, useCallback, useState } from "react";
import { UploadIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { uploadFileToS3 } from "@/lib/utils";

interface DropzoneFieldProps {
  name: string;
  filePathName: string;
  multiple?: boolean;
  destinationPathPrefix: string;
  description?: string;
}

export const DropzoneField: FC<DropzoneFieldProps> = ({
  name,
  filePathName,
  multiple,
  destinationPathPrefix,
  description,
  ...rest
}) => {
  const { setValue, getValues } = useFormContext();
  const files = getValues(name);
  const filePaths = getValues(filePathName);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );
  const [abortControllers, setAbortControllers] = useState<
    Record<string, AbortController>
  >({});

  const onDrop = useCallback(
    async (droppedFiles: File[]) => {
      setValue(name, droppedFiles[0], { shouldValidate: true });
      for (const file of droppedFiles) {
        const controller = new AbortController();
        setAbortControllers((prev) => ({ ...prev, [file.name]: controller }));
        const destinationPath = `${destinationPathPrefix.endsWith("/") ? destinationPathPrefix.slice(0, -1) : destinationPathPrefix}/${file.name}`;
        await uploadFileToS3({
          file,
          destinationPath,
          signal: controller.signal,
          onProgress: (progress: number) => {
            setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
            if (progress === 100) {
              setValue(filePathName, {
                ...filePaths,
                [file.name]: destinationPath,
              });
            }
          },
        });
      }
    },
    [setValue, name, destinationPathPrefix, filePathName, filePaths],
  );
  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file_array = Array.from(e.target.files || []);
    await onDrop(file_array);
  };
  const handleCancelUpload = (fileName: string) => {
    setValue(name, undefined, { shouldValidate: true });
    if (abortControllers[fileName]) {
      abortControllers[fileName].abort();
      setAbortControllers((prev) => {
        const newControllers = { ...prev };
        delete newControllers[fileName];
        return newControllers;
      });
    }
  };

  return (
    <>
      {!files && (
        <Dropzone
          multiple={multiple}
          onDrop={onDrop}
          {...rest}
          description={description}
          onChange={onChange}
        />
      )}
      {files && (
        <div className="mt-4 space-y-2">
          <Card className="relative">
            <Button
              variant="ghost"
              className="absolute right-2 top-2"
              onClick={() => handleCancelUpload(files.name)}
            >
              <XIcon className="h-5 w-5" />
            </Button>
            <CardHeader>
              <CardTitle>{files.name}</CardTitle>
              <CardDescription>
                {(files.size / 1024).toFixed(2)} KB
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={uploadProgress[files.name] || 0} />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

const Dropzone: FC<{
  multiple?: boolean;
  description?: string;
  onDrop: (acceptedFiles: File[]) => void;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}> = ({ multiple, description, onChange, onDrop, ...rest }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple,
    ...rest,
    onDrop,
  });

  return (
    <div {...getRootProps()}>
      {isDragActive ? (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-md border-2 border-dashed border-gray-300 bg-gray-400 px-6 py-12 transition-colors focus-within:border-transparent focus-within:ring-2 focus-within:ring-primary hover:border-gray-400">
          <UploadIcon className="h-12 w-12 text-gray-600" />
          <div className="font-medium text-gray-900 dark:text-gray-50">
            Please Drop the file within the highlighted area.
          </div>
          {description && (
            <div className="text-sm text-gray-500">{description}</div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-md border-2 border-dashed border-gray-300 px-6 py-12 transition-colors focus-within:border-transparent focus-within:ring-2 focus-within:ring-primary hover:border-gray-400">
          <UploadIcon className="h-12 w-12 text-gray-600" />
          <div className="font-medium text-gray-900 dark:text-gray-50">
            Drop multiple file here or click to upload
          </div>
          {description && (
            <div className="text-sm text-gray-500">{description}</div>
          )}
          <Input {...getInputProps({ onChange })} />
        </div>
      )}
    </div>
  );
};
