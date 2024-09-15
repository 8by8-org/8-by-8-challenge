import { headers } from "next/headers";
import { SearchParams } from "../../constants/search-params";

export function createShareLink() {
  const protocol = getProtocol();
  const host = getHost();
  const pathname = "share";

  return `${protocol}://${host}/${pathname}?${SearchParams.InviteCode}=`;
}

function getProtocol() {
  const referer = headers().get("referer");
  if (referer) {
    return referer.split("://")[0];
  }
  
  // Fallback 
  return "";
}

function getHost() {
  const referer = headers().get("referer");
  if (referer) {
    return referer.split("://")[1].split("/")[0];
  }

  // Fallback 
  return "";  //
}
