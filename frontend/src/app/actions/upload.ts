"use server";

export async function uploadSurvey(formData: FormData) {
    const file = formData.get("file") as File;

    if (!file) {
        return { error: "No file uploaded." };
    }

    // Validate file type
    const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/msword" // .doc
    ];

    if (!validTypes.includes(file.type)) {
        return { error: "Invalid File Type. Please upload a PDF or Word document." };
    }

    try {
        // Send to Python Backend /parse endpoint
        // Next.js Server Actions can talk to local services
        const backendFormData = new FormData();
        backendFormData.append("file", file);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parse`, {
            method: "POST",
            body: backendFormData,
        });

        if (!response.ok) {
            throw new Error(`Backend error: ${response.statusText}`);
        }

        const data = await response.json();

        // Return the parsed questions and metadata
        return {
            success: true,
            questions: data.questions,
            filename: data.filename
        };

    } catch (err: any) {
        console.error("Upload Action Error:", err);
        return { error: "Failed to process survey. Ensure the backend is running." };
    }
}
