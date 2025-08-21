import { Contiguity } from "@/contiguity.ts";

export { Contiguity };

export { ContiguityResponse, ContiguityRawResponse } from "@/types/response.ts";
export { ContiguityAPIError, ContiguityError, ContiguitySDKError } from "@/types/error.ts";
export { 
    TextSendRequest, 
    TextResponse, 
    TextSendResponseFlattened,
    TextSendResponseRaw 
} from "@/services/text/send.ts";
export {
    EmailSendRequest,
    EmailResponse,
    EmailSendResponseRaw
} from "@/services/email/send.ts";

export default Contiguity;