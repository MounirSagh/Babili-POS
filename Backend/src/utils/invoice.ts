import axios from "axios";

export const downloadInvoice = async (filePath: string) => {
  try {
    // Ensure the filePath is complete and valid
    const serverBaseUrl = process.env.SERVER_BASE_URL || "http://localhost:3000";
    const fullUrl = filePath.startsWith("http")
      ? filePath
      : `${serverBaseUrl}/${filePath}`;

    // Initiate the download using axios
    const response = await axios.get(fullUrl, { responseType: "blob" });

    // Create a blob and a link for the download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      filePath.split("/").pop() || "invoice.pdf" // Extract filename
    );
    document.body.appendChild(link);
    link.click();

    // Clean up
    link.remove();
    window.URL.revokeObjectURL(url);

    console.log("Invoice downloaded successfully.");
  } catch (error) {
    console.error("Error downloading invoice:", error);
  }
};
