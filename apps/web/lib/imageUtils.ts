/**
 * Resizes and compresses an image file entirely in the browser (no server
 * round-trip) and returns it as a base64 data URL, ready to be saved
 * directly inside the resume's content JSON (personalInfo.photoUrl).
 *
 * Keeping this small (max ~400px, JPEG quality 0.8) matters because the
 * result gets stored as text inside a database JSON column — an
 * uncompressed phone photo could be several MB, while this typically comes
 * out under ~150KB.
 */
export function compressImageToDataUrl(
    file: File,
    maxDimension = 400,
    quality = 0.8
): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                let { width, height } = img;

                if (width > height && width > maxDimension) {
                    height = Math.round((height * maxDimension) / width);
                    width = maxDimension;
                } else if (height > maxDimension) {
                    width = Math.round((width * maxDimension) / height);
                    height = maxDimension;
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Your browser doesn't support image processing."));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL("image/jpeg", quality));
            };

            img.onerror = () => reject(new Error("Could not read that image. Please try another file."));
            img.src = e.target?.result as string;
        };

        reader.onerror = () => reject(new Error("Could not read that file."));
        reader.readAsDataURL(file);
    });
}