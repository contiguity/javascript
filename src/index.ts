import { Contiguity } from "@/contiguity";

export { Contiguity };

export { ContiguityResponse, ContiguityRawResponse } from "@/types/response";
export { ContiguityAPIError, ContiguityError, ContiguitySDKError } from "@/types/error";
export type { ContiguityMetadata, WithMetadata } from "@/types/metadata";
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
    TextResponse, 
    TextSendResponseFlattened,
    TextSendResponseRaw 
} from "@/services/text/send";
export {
    EmailSendRequest,
    EmailResponse,
    EmailSendResponseRaw
} from "@/services/email/send";
export {
    iMessageSendRequest,
    iMessageResponse,
    iMessageSendResponseFlattened,
    iMessageSendResponseRaw
} from "@/services/imessage/send";
export {
    iMessageTypingRequest,
    iMessageTypingResponse,
    iMessageTypingResponseFlattened,
    iMessageTypingResponseRaw
} from "@/services/imessage/typing";
export {
    WhatsAppSendRequest,
    WhatsAppResponse,
    WhatsAppSendResponseFlattened,
    WhatsAppSendResponseRaw
} from "@/services/whatsapp/send";
export {
    WhatsAppTypingRequest,
    WhatsAppTypingResponse,
    WhatsAppTypingResponseFlattened,
    WhatsAppTypingResponseRaw
} from "@/services/whatsapp/typing";
export {
    LeaseAvailableResponse,
    LeaseAvailableResponseRaw,
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
    LeaseGetResponse,
    LeaseGetResponseRaw
} from "@/services/lease/get";
export {
    LeaseCreateRequest,
    LeaseCreateResponse,
    LeaseCreateResponseRaw,
    LeaseBillingPrice,
    LeaseBillingPeriod,
    LeaseBilling
} from "@/services/lease/create";
export {
    LeaseLeasedResponse,
    LeaseLeasedResponseRaw,
    LeasedNumber,
    LeasedBillingPeriod,
    LeasedBilling
} from "@/services/lease/leased";
export {
    LeaseDetailsRequest,
    LeaseDetailsResponse,
    LeaseDetailsResponseRaw
} from "@/services/lease/details";
export {
    LeaseTerminateRequest,
    LeaseTerminateResponse,
    LeaseTerminateResponseRaw
} from "@/services/lease/terminate";
export {
    OTPNewRequest,
    OTPNewResponse,
    OTPNewResponseFlattened,
    OTPNewResponseRaw
} from "@/services/otp/new";
export {
    OTPVerifyRequest,
    OTPVerifyResponse,
    OTPVerifyResponseFlattened,
    OTPVerifyResponseRaw
} from "@/services/otp/verify";
export {
    OTPResendRequest,
    OTPResendResponse,
    OTPResendResponseFlattened,
    OTPResendResponseRaw
} from "@/services/otp/resend";
export {
    DomainsListResponse,
    DomainInfo
} from "@/services/domains/list";
export {
    DomainsGetRequest,
    DomainsGetResponse,
    DomainsGetResponseFlattened,
    DomainsGetResponseRaw,
    DNSRecord,
    DomainVerifications
} from "@/services/domains/get";
export {
    DomainsRegisterRequest,
    DomainsRegisterResponse,
    DomainsRegisterResponseFlattened,
    DomainsRegisterResponseRaw
} from "@/services/domains/register";
export {
    DomainsDeleteRequest,
    DomainsDeleteResponse,
    DomainsDeleteResponseFlattened,
    DomainsDeleteResponseRaw
} from "@/services/domains/delete";

export default Contiguity;