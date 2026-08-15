export type FileMetadata = Pick<File, "size" | "type">;

export function validateUploadFile(
  file: FileMetadata,
  acceptedTypes: readonly string[],
  maxBytes: number
): boolean {
  return acceptedTypes.includes(file.type) && file.size <= maxBytes;
}

export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () =>
      reject(new Error("The selected file could not be read."));
    reader.onload = () => {
      const raw = String(reader.result).split(",")[1];
      if (!raw) {
        reject(new Error("The selected file has no readable content."));
        return;
      }
      resolve(raw);
    };
    reader.readAsDataURL(file);
  });
}
