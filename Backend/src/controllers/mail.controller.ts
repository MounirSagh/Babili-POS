import { Request, Response } from "express";
import { sendApprovalEmailService, sendConfirmationEmailService, sendRejectionEmailService} from "../services/mail.service";

export async function sendApprovalEmailController(req: any, res: any) {
  try {
    const { toEmail } = req.body;
    await sendApprovalEmailService(toEmail);
    return res.status(200).send({message: "Mail sent 👌"});
  } catch (error) {
    return res.status(500).send(error);
  }
};

export async function sendRejectionEmailController(req: any, res: any) {
  try {
    const { toEmail } = req.body;
    await sendRejectionEmailService(toEmail);
    return res.status(200).send({message: "Mail sent 👌"});
  } catch (error) {
    return res.status(500).send(error);
  }
};


export async function sendConfirmationEmailController(req: any, res: any) {
  try {
    const { toEmail } = req.body;
    await sendConfirmationEmailService(toEmail);
    return res.status(200).send({message: "Mail sent 👌"});
  } catch (error) {
    return res.status(500).send(error);
  }
};

