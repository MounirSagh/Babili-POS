import fs from "fs";
import PDFDocument from "pdfkit";

export const generateInvoicePDF = async (data: any, filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Invoice Header
      doc.fontSize(20).text("Invoice", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Order ID: ${data.orderId}`);
      doc.text(`Date: ${new Date(data.date).toLocaleString()}`);
      doc.text(`Customer Name: ${data.userDetails.firstName} ${data.userDetails.lastName}`);
      doc.text(`Email: ${data.userDetails.email}`);
      doc.text(
        `Address: ${data.userDetails.address}, ${data.userDetails.city}, ${data.userDetails.postalCode}, ${data.userDetails.country}`
      );
      doc.moveDown();

      // Order Details Header
      doc.fontSize(14).text("Order Details", { underline: true });
      doc.moveDown();

      // Table Headers
      doc.fontSize(12).text("Item", 50, doc.y, { continued: true });
      doc.text("Subcategory", 200, doc.y, { continued: true });
      doc.text("Attributes", 350, doc.y, { continued: true });
      doc.text("Quantity", 450, doc.y, { continued: true });
      doc.text("Price", 500, doc.y, { continued: true });
      doc.text("Subtotal", 550, doc.y);
      doc.moveDown();

      // Order Items
      data.cartItems.forEach((item: any, index: number) => {
        const itemName = item.REF || "Undefined";
        const subcategoryName = item.subcategoryName || "Unknown Subcategory";
        const attributes = item.attributes
          ? item.attributes.map((attr: any) => `${attr.key}: ${attr.value}`).join(", ")
          : "No Attributes";
        const quantity = item.quantity || 0;
        const price = item.price || 0;
        const subtotal = quantity * price;
      
        doc.text(`${index + 1}. ${itemName}`, 50, doc.y, { continued: true });
        doc.text(subcategoryName, 200, doc.y, { continued: true });
        doc.text(attributes, 350, doc.y, { continued: true });
        doc.text(quantity.toString(), 450, doc.y, { continued: true });
        doc.text(`$${price.toFixed(2)}`, 500, doc.y, { continued: true });
        doc.text(`$${subtotal.toFixed(2)}`, 550, doc.y);
        doc.moveDown();
      });
      

      // Total Price
      doc.fontSize(14).text(`Total Price: $${data.totalPrice.toFixed(2)}`, {
        align: "right",
      });
      doc.moveDown();

      // Footer
      doc
        .fontSize(10)
        .text(
          "Thank you for your purchase! If you have any questions about this invoice, please contact support@example.com",
          { align: "center" }
        );

      doc.end();

      writeStream.on("finish", () => {
        resolve();
      });

      writeStream.on("error", (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};
