import { z } from 'zod';
import { requestBodySchema } from './request-body-schema';
import { RTV_PARTNER_ID } from '@/constants/rtv-partner-id';
import { DateTime } from 'luxon';

interface RTVRequestBody {
  lang: string;
  partner_id: string;
  send_confirmation_reminder_emails: boolean;
  created_at: string;
  updated_at: string;
  date_of_birth: string;
  id_number: string;
  email_address: string;
  first_registration: boolean;
  home_zip_code: string;
  us_citizen: boolean;
  has_state_license: boolean;
  is_eighteen_or_older: boolean;
  name_title: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  name_suffix?: string;
  home_address: string;
  home_unit?: string;
  home_city: string;
  home_state_id: string;
  has_mailing_address: boolean;
  mailing_address?: string;
  mailing_unit?: string;
  mailing_city?: string;
  mailing_state_id?: string;
  mailing_zip_code?: string;
  race: string;
  party: string;
  phone?: string;
  phone_type?: string;
  change_of_name: boolean;
  prev_name_title?: string;
  prev_first_name?: string;
  prev_middle_name?: string;
  prev_last_name?: string;
  prev_name_suffix?: string;
  change_of_address: boolean;
  prev_address?: string;
  prev_unit?: string;
  prev_city?: string;
  prev_state_id?: string;
  prev_zip_code?: string;
  opt_in_email: boolean;
  opt_in_sms: boolean;
  opt_in_volunteer: boolean;
  partner_opt_in_email: boolean;
  partner_opt_in_sms: boolean;
  partner_opt_in_volunteer: boolean;
}

export function createRTVRequestBodyFromFormData(
  formData: z.infer<typeof requestBodySchema>,
): RTVRequestBody {
  const createdAt = DateTime.now().toFormat('MMddyyyy hh:mm:ss');

  return {
    lang: 'en',
    partner_id: `${RTV_PARTNER_ID}`,
    /*
      set send_confirmation_reminder_emails to true so that the user 
      receives their completed voter registration form via email.
    */
    send_confirmation_reminder_emails: true,
    created_at: createdAt,
    updated_at: createdAt,
    date_of_birth: formData.eligibility.dob,
    id_number: formData.otherDetails.idNumber,
    email_address: formData.eligibility.email,
    first_registration: formData.eligibility.firstTimeRegistrant,
    home_zip_code: formData.addresses.homeAddress.zip,
    us_citizen: formData.eligibility.isCitizen,
    has_state_license: formData.otherDetails.hasStateLicenseOrID,
    is_eighteen_or_older: formData.eligibility.eighteenPlus,
    name_title: formData.names.yourName.title,
    first_name: formData.names.yourName.first,
    middle_name: formData.names.yourName.middle,
    last_name: formData.names.yourName.last,
    name_suffix: formData.names.yourName.suffix,
    home_address: formData.addresses.homeAddress.streetLine1,
    home_unit: formData.addresses.homeAddress.streetLine2,
    home_city: formData.addresses.homeAddress.city,
    home_state_id: formData.addresses.homeAddress.state,
    has_mailing_address: !!formData.addresses.mailingAddress,
    mailing_address: formData.addresses.mailingAddress?.streetLine1,
    mailing_unit: formData.addresses.mailingAddress?.streetLine2,
    mailing_city: formData.addresses.mailingAddress?.city,
    mailing_state_id: formData.addresses.mailingAddress?.state,
    mailing_zip_code: formData.addresses.mailingAddress?.zip,
    race: formData.otherDetails.race,
    party: formData.otherDetails.party,
    phone: formData.addresses.homeAddress.phone,
    phone_type: formData.addresses.homeAddress.phoneType,
    change_of_name: !!formData.names.previousName,
    prev_name_title: formData.names.previousName?.title,
    prev_first_name: formData.names.previousName?.first,
    prev_middle_name: formData.names.previousName?.middle,
    prev_last_name: formData.names.previousName?.last,
    prev_name_suffix: formData.names.previousName?.suffix,
    change_of_address: !!formData.addresses.previousAddress,
    prev_address: formData.addresses.previousAddress?.streetLine1,
    prev_unit: formData.addresses.previousAddress?.streetLine2,
    prev_city: formData.addresses.previousAddress?.city,
    prev_state_id: formData.addresses.previousAddress?.state,
    prev_zip_code: formData.addresses.previousAddress?.zip,
    opt_in_email: formData.otherDetails.receiveEmailsFromRTV,
    opt_in_sms: formData.otherDetails.receiveSMSFromRTV,
    opt_in_volunteer: false,
    partner_opt_in_email: false,
    partner_opt_in_sms: false,
    partner_opt_in_volunteer: false,
  };
}
