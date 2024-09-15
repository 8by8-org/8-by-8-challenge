import { headers } from "next/headers";
import { SearchParams } from "../../constants/search-params";

export function createShareLink() {
  const protocol = getProtocol();
  const host = getHost();
  const pathname = "share";
  const environment = process.env.NODE_ENV;

  // Development environment link
  if (environment === 'development') { 
    return `${protocol}://${host}/${pathname}?${SearchParams.InviteCode}=`;
  }

  // Production environment link
  return `https://challenge.8by8.us/${pathname}?${SearchParams.InviteCode}=`;
}

function getProtocol() {
  const referer = headers().get("referer");
  if (referer) {
    return referer.split("://")[0];
  }
  
  // Fallback to "https" if referer is not available
  return "https";
}

function getHost() {
  const referer = headers().get("referer");
  if (referer) {
    return referer.split("://")[1].split("/")[0];
  }

  // Fallback to the production host
  return "challenge.8by8.us";
}
