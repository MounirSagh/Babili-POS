"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadInvoice = void 0;
const axios_1 = __importDefault(require("axios"));
const downloadInvoice = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure the filePath is complete and valid
        const serverBaseUrl = process.env.SERVER_BASE_URL || "http://localhost:3000";
        const fullUrl = filePath.startsWith("http")
            ? filePath
            : `${serverBaseUrl}/${filePath}`;
        // Initiate the download using axios
        const response = yield axios_1.default.get(fullUrl, { responseType: "blob" });
        // Create a blob and a link for the download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filePath.split("/").pop() || "invoice.pdf" // Extract filename
        );
        document.body.appendChild(link);
        link.click();
        // Clean up
        link.remove();
        window.URL.revokeObjectURL(url);
        console.log("Invoice downloaded successfully.");
    }
    catch (error) {
        console.error("Error downloading invoice:", error);
    }
});
exports.downloadInvoice = downloadInvoice;
