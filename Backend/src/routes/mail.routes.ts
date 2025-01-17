import { Router } from "express";
import { sendApprovalEmailController, sendConfirmationEmailController , sendRejectionEmailController} from '../controllers/mail.controller';

const mailRouter = Router();

mailRouter.post('/approval', sendApprovalEmailController)
mailRouter.post('/rejection', sendRejectionEmailController)
mailRouter.post('/confirmation', sendConfirmationEmailController)


export default mailRouter;