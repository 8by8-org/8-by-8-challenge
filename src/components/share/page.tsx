"use client";
import { useContext } from "react";
import { InviteCodeContext } from "../../contexts/invite-code-user";

/* 
  This component can import React hooks, etc. It can receive the 
  link created within a server component through props and then 
  add the actual invite code it reads from context. You do not 
  need to create a context (it already exists--the UserContext),
  your component can just read the invite code from the User 
  as you have been already doing.
*/

interface ShareProps {
  shareLink: string;
}

export function Share({ shareLink }: ShareProps) {
  const inviteCode = useContext(InviteCodeContext);
  const fullLink = shareLink + inviteCode;
  console.log(fullLink)
  return <p>{fullLink}</p>;
}
