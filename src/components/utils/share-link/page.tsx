import { headers } from "next/headers";
import { SearchParams } from "../../../constants/search-params";

export function createShareLink() {
  const protocol = getProtocol();
  const host = getHost();
  const pathname = "share";

  return `${protocol}://${host}/${pathname}?${SearchParams.InviteCode}=`;
}

function getProtocol() {
  return headers().get("referer")!.split("://")[0];
}

function getHost() {
  return headers().get("host");
}
