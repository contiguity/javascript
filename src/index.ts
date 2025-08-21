import { Contiguity } from "@/contiguity";

export { Contiguity };

export { ContiguityResponse, ContiguityRawResponse } from "@/types/response";
export { ContiguityAPIError, ContiguityError, ContiguitySDKError } from "@/types/error";
export type { ContiguityMetadata, WithMetadata } from "@/types/metadata";
export { createResponse, BaseResponseBuilder, type BaseResponse, type FlattenedResponse, type RawResponse } from "@/types/base";
export {
    E164PhoneNumber,
    MessageContent,
    OptionalSenderNumber,
    AttachmentList,
    SingleOrMultipleEmails,
    TypingAction,
    NumberStatus,
    LeaseStatus,
    BillingMethod,
    Currency,
    Carrier,
    MessageChannel,
    createFallbackSchema
} from "@/types/common";
export { 
    TextSendRequest, 
    TextResponse
} from "@/services/text/send";
export {
    EmailSendRequest,
    EmailResponse
} from "@/services/email/send";
export {
    iMessageSendRequest,
    iMessageResponse
} from "@/services/imessage/send";
export {
    iMessageTypingRequest,
    iMessageTypingResponse
} from "@/services/imessage/typing";
export {
    WhatsAppSendRequest,
    WhatsAppResponse
} from "@/services/whatsapp/send";
export {
    WhatsAppTypingRequest,
    WhatsAppTypingResponse
} from "@/services/whatsapp/typing";
export {
    LeaseAvailableResponse,
    AvailableNumber,
    NumberCapabilities,
    NumberHealth,
    NumberLocation,
    NumberFormat,
    NumberData,
    NumberPricing
} from "@/services/lease/available";
export {
    LeaseGetRequest,
    LeaseGetResponse
} from "@/services/lease/get";
export {
    LeaseCreateRequest,
    LeaseCreateResponse,
    LeaseBillingPrice,
    LeaseBillingPeriod,
    LeaseBilling
} from "@/services/lease/create";
export {
    LeaseLeasedResponse,
    LeasedNumber,
    LeasedBillingPeriod,
    LeasedBilling
} from "@/services/lease/leased";
export {
    LeaseDetailsRequest,
    LeaseDetailsResponse
} from "@/services/lease/details";
export {
    LeaseTerminateRequest,
    LeaseTerminateResponse
} from "@/services/lease/terminate";
export {
    OTPNewRequest,
    OTPNewResponse
} from "@/services/otp/new";
export {
    OTPVerifyRequest,
    OTPVerifyResponse
} from "@/services/otp/verify";
export {
    OTPResendRequest,
    OTPResendResponse
} from "@/services/otp/resend";
export {
    DomainsListResponse,
    DomainInfo
} from "@/services/domains/list";
export {
    DomainsGetRequest,
    DomainsGetResponse,
    DNSRecord,
    DomainVerifications
} from "@/services/domains/get";
export {
    DomainsRegisterRequest,
    DomainsRegisterResponse
} from "@/services/domains/register";
export {
    DomainsDeleteRequest,
    DomainsDeleteResponse
} from "@/services/domains/delete";

export default Contiguity;