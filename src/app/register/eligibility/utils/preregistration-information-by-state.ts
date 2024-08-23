import { US_STATE_ABBREVIATIONS } from '@/constants/us-state-abbreviations';

/**
 * Messages that can be displayed to the user if they are under 18 years old and
 * attempt to register to vote. Each message describes the requirements for
 * preregistering to vote for a given state. North Dakota is omitted because,
 * as of the time of writing, residents of North Dakota do not need to register
 * to vote in order to do so.
 *
 * @remarks
 * This information was sourced from [Rock The Vote](https://www.rockthevote.org/how-to-vote/nationwide-voting-info/voter-pre-registration/).
 *
 * For more information on voting in North Dakota, please see [Voting in North Dakota](https://www.sos.nd.gov/elections/voter/voting-north-dakota).
 */
export const PREREGISTRATION_INFO_BY_STATE = {
  [US_STATE_ABBREVIATIONS.ALABAMA]:
    'You must be at least 18 years old by Election Day to preregister to vote in Alabama.',
  [US_STATE_ABBREVIATIONS.ALASKA]:
    'You must be at least 17 years old and within 90 days of your 18th birthday to preregister to vote in Alaska. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.ARIZONA]:
    'You must be at least 18 years old by the date of the next general election to preregister to vote in Arizona.',
  [US_STATE_ABBREVIATIONS.ARKANSAS]:
    'You must be at least 18 years old by the date of the next election to preregister to vote in Arkansas.',
  [US_STATE_ABBREVIATIONS.CALIFORNIA]:
    'You must be at least 16 years old to preregister to vote in California. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.COLORADO]:
    'You must be at least 16 years old to preregister to vote in Colorado. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.CONNECTICUT]:
    'You must be at least 17 years old now and must be at least 18 years old by the date of the next election to preregister to vote in Connecticut.',
  [US_STATE_ABBREVIATIONS.DELAWARE]:
    'You must be at least 18 years old by the date of the next general election to preregister to vote using this app in Delaware.',
  [US_STATE_ABBREVIATIONS.DISTRICT_OF_COLUMBIA]:
    'You must be at least 16 years old to preregister to vote in the District of Columbia. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.FLORIDA]:
    'You must be at least 16 years old to preregister to vote in Florida. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.GEORGIA]:
    'You must be at least 17 ½ years old to preregister to vote in Georgia. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.HAWAII]:
    'You must be at least 16 years old to preregister to vote in Hawaii. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.IDAHO]:
    'You must be at least 18 years old by Election Day to preregister to vote in Idaho.',
  [US_STATE_ABBREVIATIONS.ILLINOIS]:
    'You must be at least 18 years old by Election Day to preregister to vote using this app in Illinois.',
  [US_STATE_ABBREVIATIONS.INDIANA]:
    'You must be at least 18 years old by the date of the next general or municipal election to preregister to vote in Indiana.',
  [US_STATE_ABBREVIATIONS.IOWA]:
    'You must be at least 17 years old now and must be at least 18 years old by the date of the next election to preregister to vote in Iowa.',
  [US_STATE_ABBREVIATIONS.KANSAS]:
    'You must be at least 18 years old by the date of the next election to preregister to vote in Kansas.',
  [US_STATE_ABBREVIATIONS.KENTUCKY]:
    'You must be at least 17 years old now and must be at least 18 years old by the date of the next election to preregister to vote in Kentucky.',
  [US_STATE_ABBREVIATIONS.LOUISIANA]:
    'You must be at least 17 years old to preregister to vote in Lousiana. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.MAINE]:
    'You must be at least 16 years old to preregister to vote in Maine. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.MARYLAND]:
    'You must be at least 16 years old to preregister to vote in Maryland. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.MASSACHUSETTS]:
    'You must be at least 16 years old to preregister in Massachusetts. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.MICHIGAN]:
    'You must be at least 16 years old to preregister in Michigan. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.MINNESOTA]:
    'You must be at least 16 years old to preregister in Minnesota. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.MISSISSIPPI]:
    'You must be at least 18 years old by the date of the next General Election to preregister to vote in Mississippi.',
  [US_STATE_ABBREVIATIONS.MISSOURI]:
    'You must be at least 17 ½ years old now and must be at least 18 years old by election day to preregister to vote in Missouri.',
  [US_STATE_ABBREVIATIONS.MONTANA]:
    'You must be at least 18 years old by the date of the next election to preregister to vote in Montana.',
  [US_STATE_ABBREVIATIONS.NEBRASKA]:
    'You must be at least 17 years old now and must be 18 years old by the first Tuesday following the first Monday in November of this year to preregister to vote in Nebraska. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.NEVADA]:
    'You must be at least 17 years old to preregister to vote in Nevada. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.NEW_HAMPSHIRE]:
    'You must be at least 18 years old by Election Day to preregister to vote in New Hampshire.',
  [US_STATE_ABBREVIATIONS.NEW_JERSEY]:
    'You must be at least 17 years old to preregister to vote in New Jersey. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.NEW_MEXICO]:
    'You must be at least 17 years old now and must be at least 18 years old by the date of the next general election to preregister to vote in New Mexico.',
  [US_STATE_ABBREVIATIONS.NEW_YORK]:
    'You must be at least 16 years old to preregister to vote in New York. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.NORTH_CAROLINA]:
    'You must be at least 16 years old to preregister to vote in North Carolina. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.OHIO]:
    'You must be at least 18 years old by the date of the next general election to preregister to vote in Ohio.',
  [US_STATE_ABBREVIATIONS.OKLAHOMA]:
    'You must be at least 17 ½ years old now and must be at least 18 years old by Election Day to preregister to vote in Oklahoma.',
  [US_STATE_ABBREVIATIONS.OREGON]:
    'You must be at least 16 years old to preregister to vote in Oregon. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.PENNSYLVANIA]:
    'You must be at least 18 years old by the date of the next election to preregister to vote in Pennsylvania.',
  [US_STATE_ABBREVIATIONS.RHODE_ISLAND]:
    'You must be at least 16 years old to preregister to vote in Rhode Island. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.SOUTH_CAROLINA]:
    'You must be at least 18 years old by the date of the next election to preregister to vote in South Carolina.',
  [US_STATE_ABBREVIATIONS.SOUTH_DAKOTA]:
    'You must be at least 18 years old by the date of the next election to preregister to vote in South Dakota.',
  [US_STATE_ABBREVIATIONS.TENNESSEE]:
    'You must be at least 18 years old by the date of the next election to preregister to vote in Tennessee.',
  [US_STATE_ABBREVIATIONS.TEXAS]:
    'You must be at least 17 years and 10 months old now and must be 18 years old by the date of the next election to preregister to vote in Texas.',
  [US_STATE_ABBREVIATIONS.UTAH]:
    'You must be at least 16 years old to preregister to vote in Utah. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.VERMONT]:
    'You must be at least 17 years old by the date of the next election to preregister to vote in Vermont.',
  [US_STATE_ABBREVIATIONS.VIRGINIA]:
    'You must be at least 17 years old now and must be 18 years old by the date of the next general election to preregister to vote in Virginia.',
  [US_STATE_ABBREVIATIONS.WASHINGTON]:
    'You must be at least 16 years old to preregister to vote in Washington. Please note you will need to be 18 by election day to vote.',
  [US_STATE_ABBREVIATIONS.WEST_VIRGINIA]:
    'You must be at least 17 years old now and must be 18 years old by the date of the next general election to preregister to vote in West Virginia.',
  [US_STATE_ABBREVIATIONS.WISCONSIN]:
    'You must be at least 18 years old by the date of the next election to preregister to vote in Wisconsin.',
  [US_STATE_ABBREVIATIONS.WYOMING]:
    'You must be at least 18 years old by Election Day to preregister to vote in Wyoming.',
};
