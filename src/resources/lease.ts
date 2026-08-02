import { request } from "../utils/request.js";
import {
  leaseCreateSchema,
  type AvailableFilters,
  type AvailableLeaseNumber,
  type AvailableOptions,
  type LeaseAvailableResponse,
  type LeaseCreateOptions,
  type LeaseFilters,
  type LeasedNumber,
  type LeasedOptions,
  type LeasedResponse,
  type NumberFilters,
} from "../schemas/leases.js";
import type { RequestConfig } from "../utils/request.js";

function matchesNumber(number: AvailableLeaseNumber, filters: NumberFilters) {
  const capabilities_match =
    filters.capabilities?.every(function capability(capability) {
      return number.capabilities.channels.includes(capability);
    }) ?? true;
  const location = filters.location;

  return (
    capabilities_match &&
    (!location?.country || number.location.country === location.country) &&
    (!location?.region || number.location.region === location.region) &&
    (!location?.city || number.location.city === location.city)
  );
}

function matchesAvailable(number: AvailableLeaseNumber, filters: AvailableFilters) {
  return (!filters.status || number.status === filters.status) && matchesNumber(number, filters);
}

function matchesLease(number: LeasedNumber, filters: LeaseFilters) {
  return (!filters.status || number.lease_status === filters.status) && matchesNumber(number, filters);
}

export class LeaseResource {
  constructor(private readonly config: RequestConfig) {}

  async available(options: AvailableOptions = {}) {
    const response = await request<LeaseAvailableResponse>(this.config, "/leases", { method: "GET" });
    const filters = options.filter ?? {};
    const numbers = response.numbers.filter(function filter(number) {
      return matchesAvailable(number, filters);
    });

    return { ...response, available: numbers.length, numbers };
  }

  async get(number: string) {
    return request(this.config, `/${encodeURIComponent(number)}`, { method: "GET" });
  }

  async create(number: string, options?: LeaseCreateOptions) {
    const body = options ? (leaseCreateSchema.parse(options) as Record<string, unknown>) : {};
    return request(this.config, `/lease/${encodeURIComponent(number)}`, {
      method: "POST",
      body,
    });
  }

  async leased(options: LeasedOptions = {}) {
    const response = await request<LeasedResponse>(this.config, "/leased", { method: "GET" });
    const filters = options.filter ?? {};
    const numbers = response.numbers.filter(function filter(number) {
      return matchesLease(number, filters);
    });

    return { ...response, leased: numbers.length, numbers };
  }

  async details(number: string) {
    return request(this.config, `/leased/${encodeURIComponent(number)}`, { method: "GET" });
  }

  async terminate(number: string) {
    return request(this.config, `/leased/${encodeURIComponent(number)}`, { method: "DELETE" });
  }
}
