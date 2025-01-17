import express, { Request, Response } from "express";
import { createSale, getSales,downloadInvoice ,getSalesAnalytics} from "../controllers/sale.controller";


const router = express.Router();

// Route to create a new sale
router.post("/addsale", async (req: Request, res: Response) => {
  try {
    await createSale(req, res);
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: "Error creating sale", error });
  }
});

// Route to fetch all sales
router.get("/getsales", async (req: Request, res: Response) => {
  try {
    await getSales(req, res);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Error fetching sales", error });
  }
});

// Route to download an invoice
router.get("/download/:filePath", async (req: Request, res: Response) => {
  try {
    await downloadInvoice(req, res);
  } catch (error) {
    console.error("Error downloading invoice:", error);
    res.status(500).json({ message: "Error downloading invoice", error });
  }
});


router.get("/analytics", getSalesAnalytics);


export default router;
