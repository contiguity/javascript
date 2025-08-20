import { Contiguity } from "@/contiguity.js";

export { Contiguity };

export { ContiguityResponse, ContiguityRawResponse } from "@/types/response.js";
export { ContiguityAPIError, ContiguityError } from "@/types/error.js";
export { 
    TextSendRequest, 
    TextResponse, 
    TextSendResponseFlattened,
    TextSendResponseRaw 
} from "@/services/send/text.js";

export default Contiguity;