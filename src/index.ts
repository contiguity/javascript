import { Contiguity } from "@/contiguity.ts";

export { Contiguity };

export { ContiguityResponse, ContiguityRawResponse } from "@/types/response.ts";
export { ContiguityAPIError, ContiguityError, ContiguitySDKError } from "@/types/error.ts";
export type { ContiguityMetadata, WithMetadata } from "@/types/metadata.ts";
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
} from "@/types/common.ts";
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
export {
    iMessageSendRequest,
    iMessageResponse,
    iMessageSendResponseFlattened,
    iMessageSendResponseRaw
} from "@/services/imessage/send.ts";
export {
    iMessageTypingRequest,
    iMessageTypingResponse,
    iMessageTypingResponseFlattened,
    iMessageTypingResponseRaw
} from "@/services/imessage/typing.ts";
export {
    WhatsAppSendRequest,
    WhatsAppResponse,
    WhatsAppSendResponseFlattened,
    WhatsAppSendResponseRaw
} from "@/services/whatsapp/send.ts";
export {
    WhatsAppTypingRequest,
    WhatsAppTypingResponse,
    WhatsAppTypingResponseFlattened,
    WhatsAppTypingResponseRaw
} from "@/services/whatsapp/typing.ts";
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
} from "@/services/lease/available.ts";
export {
    LeaseGetRequest,
    LeaseGetResponse,
    LeaseGetResponseRaw
} from "@/services/lease/get.ts";
export {
    LeaseCreateRequest,
    LeaseCreateResponse,
    LeaseCreateResponseRaw,
    LeaseBillingPrice,
    LeaseBillingPeriod,
    LeaseBilling
} from "@/services/lease/create.ts";
export {
    LeaseLeasedResponse,
    LeaseLeasedResponseRaw,
    LeasedNumber,
    LeasedBillingPeriod,
    LeasedBilling
} from "@/services/lease/leased.ts";
export {
    LeaseDetailsRequest,
    LeaseDetailsResponse,
    LeaseDetailsResponseRaw
} from "@/services/lease/details.ts";
export {
    LeaseTerminateRequest,
    LeaseTerminateResponse,
    LeaseTerminateResponseRaw
} from "@/services/lease/terminate.ts";
export {
    OTPNewRequest,
    OTPNewResponse,
    OTPNewResponseFlattened,
    OTPNewResponseRaw
} from "@/services/otp/new.ts";
export {
    OTPVerifyRequest,
    OTPVerifyResponse,
    OTPVerifyResponseFlattened,
    OTPVerifyResponseRaw
} from "@/services/otp/verify.ts";
export {
    OTPResendRequest,
    OTPResendResponse,
    OTPResendResponseFlattened,
    OTPResendResponseRaw
} from "@/services/otp/resend.ts";
export {
    DomainsListResponse,
    DomainInfo
} from "@/services/domains/list.ts";
export {
    DomainsGetRequest,
    DomainsGetResponse,
    DomainsGetResponseFlattened,
    DomainsGetResponseRaw,
    DNSRecord,
    DomainVerifications
} from "@/services/domains/get.ts";
export {
    DomainsRegisterRequest,
    DomainsRegisterResponse,
    DomainsRegisterResponseFlattened,
    DomainsRegisterResponseRaw
} from "@/services/domains/register.ts";
export {
    DomainsDeleteRequest,
    DomainsDeleteResponse,
    DomainsDeleteResponseFlattened,
    DomainsDeleteResponseRaw
} from "@/services/domains/delete.ts";

export default Contiguity;