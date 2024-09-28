import { headers } from "next/headers";
import { SearchParams } from "../../constants/search-params";

export function createShareLink() {
  const protocol = getProtocol();
  const host = getHost();
  const pathname = "share";
  const environment = process.env.NODE_ENV;


  if (environment === 'development') { 
    return `${protocol}://${host}/${pathname}?${SearchParams.InviteCode}=`;
  }


  return `https://challenge.8by8.us/${pathname}?${SearchParams.InviteCode}=`;
}

function getProtocol() {
  const referer = headers().get("referer");
  if (referer) {
    return referer.split("://")[0];
  }
  

  return "https";
}

function getHost() {
  const referer = headers().get("referer");
  if (referer) {
    return referer.split("://")[1].split("/")[0];
  }


  return "challenge.8by8.us";
}
