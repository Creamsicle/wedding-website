import * as functions from "firebase-functions/v1"; // Use v1 for .document().onUpdate()
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import * as ics from "ics"; // Import the ics library

// Initialize Firebase Admin SDK
admin.initializeApp();

// --- Type Definitions (Keep in sync with src/lib/firebase/rsvp.ts) ---
interface RSVPResponse {
  hinduCeremonyAttending: boolean;
  weddingReceptionAttending: boolean;
  mealPreference?: "Chicken" | "Steak" | "Vegetarian Risotto";
  dietaryRestrictions?: string;
  needsRideToHinduCeremony?: boolean;
  hinduCeremonyRideDetails?: string;
  needsRideToWedding?: boolean;
  weddingRideDetails?: string;
  canOfferRide?: boolean;
  rideOfferDetails?: string;
  email?: string; // Critical for sending confirmation
  physicalAddress?: {
    street?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
  };
  otherComments?: string;
  timestamp: admin.firestore.Timestamp; // Firestore timestamp
}

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  partyId: string;
  rsvpResponse?: RSVPResponse;
}
// --- End Type Definitions ---

// --- Nodemailer Configuration ---
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

if (!gmailEmail || !gmailPassword) {
  console.error(
    "ERROR: Gmail credentials are not set in Firebase Functions config. " +
    "Please set them by running: " +
    "firebase functions:config:set gmail.email=\"YOUR_GMAIL_ADDRESS\" gmail.password=\"YOUR_APP_PASSWORD\"" +
    "Replace YOUR_GMAIL_ADDRESS and YOUR_APP_PASSWORD with your actual credentials."
  );
  // Consider throwing an error here or using placeholder values if you want the function to deploy
  // but fail gracefully at runtime if config is missing, to avoid deployment failures.
}

const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const APP_NAME = "Chelsea and Neil's Wedding"; // Or your website's name
// --- End Nodemailer Configuration ---

// --- Event Details for ICS Files ---
const globalEventSettings = {
  url: "https://vandergoel.com",
  organizer: { name: "Chelsea & Neil", email: gmailEmail },
  attendees: [] as ics.Person[],
  calName: "Chelsea & Neil's Wedding Events",
  status: "CONFIRMED",
  busyStatus: "BUSY",
};

const hinduCeremonyDetails = {
  ...globalEventSettings,
  title: "Hindu Wedding Ceremony - Chelsea & Neil",
  description: "Join Chelsea and Neil for breakfast, followed by their traditional Hindu wedding ceremony, and lunch.",
  location: "Queen's Manor Event Centre, 2 Auction Lane, Brampton, Ontario L6T 0C4",
  start: [2025, 10, 10, 8, 0],
  end: [2025, 10, 10, 13, 0],
  startInputType: "local",
  endInputType: "local",
  startOutputType: "local",
  endOutputType: "local",
};

const weddingReceptionDetails = {
  ...globalEventSettings,
  title: "Wedding Ceremony & Reception - Chelsea & Neil",
  description: "Celebrate with Chelsea and Neil at their wedding ceremony, followed by cocktail hour, dinner, and dancing!",
  location: "Art Gallery of Hamilton, 123 King Street West, Hamilton, Ontario L8P 4S8",
  start: [2025, 10, 11, 16, 0],
  end: [2025, 10, 12, 1, 0],
  startInputType: "local",
  endInputType: "local",
  startOutputType: "local",
  endOutputType: "local",
};
// --- End Event Details ---

// --- ICS Generation Helper ---
function createIcsFile(eventDetails: any): string | undefined {
  const { error, value } = ics.createEvent(eventDetails);
  if (error) {
    console.error("Error creating ICS event:", error, "Event Details Used:", eventDetails);
    return undefined;
  }
  if (value) {
    console.log("ICS content successfully generated for event:", eventDetails.title);
  } else {
    console.error("ICS content generation resulted in undefined value for event:", eventDetails.title);
  }
  return value;
}
// --- End ICS Generation Helper ---

// --- Firebase Cloud Function: sendRsvpConfirmationEmail ---
export const sendRsvpConfirmationEmail = functions.firestore
  .document("guests/{guestId}")
  .onUpdate(async (change, context) => {
    console.log("Function triggered: sendRsvpConfirmationEmail V2.5");
    const guestId = context.params.guestId;
    const newData = change.after.data() as Guest | undefined;
    const oldData = change.before.data() as Guest | undefined;

    if (!newData?.rsvpResponse?.email || !newData.partyId) {
      console.log(
        `Guest ${guestId} crucial data (RSVP, email, or partyId) is missing. No email will be sent.`
      );
      return null;
    }

    const rsvpOfTriggeringGuest = newData.rsvpResponse;
    const nameOfTriggeringGuest = `${newData.firstName} ${newData.lastName}`;
    const partyId = newData.partyId;

    // Determine if this specific update warrants an email attempt
    const oldRsvpTimestamp = oldData?.rsvpResponse?.timestamp;
    const newRsvpTimestamp = rsvpOfTriggeringGuest.timestamp;
    const oldEmailForTriggeringGuest = oldData?.rsvpResponse?.email;
    const isNewRsvp = !oldRsvpTimestamp;
    const rsvpTimestampChanged = newRsvpTimestamp && oldRsvpTimestamp && !newRsvpTimestamp.isEqual(oldRsvpTimestamp);
    const emailAddressChangedForTriggeringGuest = rsvpOfTriggeringGuest.email !== oldEmailForTriggeringGuest;
    const shouldAttemptEmailForThisUpdate = isNewRsvp || rsvpTimestampChanged || emailAddressChangedForTriggeringGuest;

    if (!shouldAttemptEmailForThisUpdate) {
      console.log(
        `RSVP for triggering guest ${guestId} (${nameOfTriggeringGuest}) has not changed significantly enough to warrant an email check.`
      );
      return null;
    }
    
    const functionInvocationTime = admin.firestore.Timestamp.now(); // Time this function instance started relevant checks
    console.log(`[${functionInvocationTime.toDate().toISOString()}] Guest update for ${nameOfTriggeringGuest} (Party ID: ${partyId}) is significant. Attempting to acquire email lock via transaction.`);

    const cooldownRef = admin.firestore().collection("partyEmailCooldowns").doc(partyId);
    const cooldownMinutes = 5;
    let allowEmailSend = false; // Flag to determine if this instance should send the email

    try {
      await admin.firestore().runTransaction(async (transaction) => {
        const cooldownDoc = await transaction.get(cooldownRef);
        const currentTimeInTransaction = admin.firestore.Timestamp.now(); // Fresh timestamp for transaction logic

        if (cooldownDoc.exists) {
          const lastSentTimestamp = cooldownDoc.data()?.lastSent as admin.firestore.Timestamp | undefined;
          if (lastSentTimestamp) {
            const minutesSinceLastSent = (currentTimeInTransaction.seconds - lastSentTimestamp.seconds) / 60;
            if (minutesSinceLastSent < cooldownMinutes) {
              console.log(
                `[${functionInvocationTime.toDate().toISOString()}] Transaction: Cooldown active for party ${partyId}. Last sent ${minutesSinceLastSent.toFixed(1)} mins ago. Suppressing email.`
              );
              allowEmailSend = false;
              return; // Abort transaction, do not update timestamp
            }
            console.log(
              `[${functionInvocationTime.toDate().toISOString()}] Transaction: Cooldown expired for party ${partyId} (${minutesSinceLastSent.toFixed(1)} mins ago). Proceeding to claim slot.`
            );
          } else {
            console.log(
              `[${functionInvocationTime.toDate().toISOString()}] Transaction: Cooldown doc for party ${partyId} exists but no lastSent. Proceeding to claim slot.`
            );
          }
        } else {
          console.log(
            `[${functionInvocationTime.toDate().toISOString()}] Transaction: No cooldown doc for party ${partyId}. Proceeding to claim slot.`
          );
        }
        // If we reach here, no active cooldown, or document/timestamp didn't exist. Claim the slot.
        transaction.set(cooldownRef, { lastSent: currentTimeInTransaction });
        allowEmailSend = true;
        console.log(
          `[${functionInvocationTime.toDate().toISOString()}] Transaction: Successfully claimed email slot for party ${partyId} at ${currentTimeInTransaction.toDate().toISOString()}.`
        );
      });
    } catch (error) {
      console.error(
        `[${functionInvocationTime.toDate().toISOString()}] Transaction for cooldown check/set failed for party ${partyId}:`,
        error
      );
      // If transaction fails (e.g., contention), this instance should not send the email.
      allowEmailSend = false;
    }

    if (!allowEmailSend) {
      console.log(
        `[${functionInvocationTime.toDate().toISOString()}] Email send for party ${partyId} (triggered by ${nameOfTriggeringGuest}) aborted due to active cooldown or transaction failure.`
      );
      return null;
    }

    // --- If we reach here, this function instance has successfully acquired the "lock" --- 
    console.log(
      `[${functionInvocationTime.toDate().toISOString()}] Party ${partyId} (triggered by ${nameOfTriggeringGuest}): Email slot acquired. Proceeding to gather data and send email.`
    );

    // Fetch all members of the party
    let partyMembers: Guest[] = [];
    try {
      const partyQuerySnapshot = await admin.firestore().collection("guests").where("partyId", "==", partyId).get();
      if (partyQuerySnapshot.empty) {
        console.log(`No guests found for partyId: ${partyId}. This should not happen if the triggering guest ${guestId} exists.`);
        console.error(`CRITICAL: Party query for ${partyId} (triggered by ${guestId}) returned empty. No email sent.`);
        return null;
      }
      partyMembers = partyQuerySnapshot.docs.map(doc => doc.data() as Guest);
    } catch (error) {
      console.error(`Error fetching party members for partyId ${partyId}:`, error);
      return null;
    }

    if (partyMembers.length === 0) {
      console.log(`Party members array is empty for partyId: ${partyId}. No email sent.`);
      return null;
    }

    const emailAddresses = new Set<string>();
    partyMembers.forEach(member => {
      if (member.rsvpResponse?.email) {
        emailAddresses.add(member.rsvpResponse.email);
      }
    });

    if (emailAddresses.size === 0) {
      console.log(`No email addresses found for any member in party ${partyId}. No email will be sent.`);
      return null;
    }
    const recipientEmails = Array.from(emailAddresses).join(",");

    let isAnyPartyMemberAttendingHindu = false;
    let isAnyPartyMemberAttendingWedding = false;
    partyMembers.forEach(member => {
      if (member.rsvpResponse?.hinduCeremonyAttending) {
        isAnyPartyMemberAttendingHindu = true;
      }
      if (member.rsvpResponse?.weddingReceptionAttending) {
        isAnyPartyMemberAttendingWedding = true;
      }
    });

    console.log(`[${functionInvocationTime.toDate().toISOString()}] Party ${partyId}: Aggregate attendance: Hindu=${isAnyPartyMemberAttendingHindu}, Wedding=${isAnyPartyMemberAttendingWedding}`);

    // Prepare ICS attachments
    const attachments = [];
    if (isAnyPartyMemberAttendingHindu) {
      console.log(`[${functionInvocationTime.toDate().toISOString()}] Party ${partyId}: Attending Hindu ceremony, attempting to create ICS.`);
      const icsContentHindu = createIcsFile(hinduCeremonyDetails);
      if (icsContentHindu) {
        attachments.push({
          filename: "HinduCeremony.ics",
          content: icsContentHindu,
          contentType: "text/calendar; charset=utf-8",
        });
        console.log(`[${functionInvocationTime.toDate().toISOString()}] Party ${partyId}: HinduCeremony.ics prepared.`);
      } else {
        console.error(`[${functionInvocationTime.toDate().toISOString()}] Party ${partyId}: Failed to generate HinduCeremony.ics content.`);
      }
    }
    if (isAnyPartyMemberAttendingWedding) {
      console.log(`[${functionInvocationTime.toDate().toISOString()}] Party ${partyId}: Attending Wedding & Reception, attempting to create ICS.`);
      const icsContentWedding = createIcsFile(weddingReceptionDetails);
      if (icsContentWedding) {
        attachments.push({
          filename: "ChelseaNeilWedding.ics",
          content: icsContentWedding,
          contentType: "text/calendar; charset=utf-8",
        });
        console.log(`[${functionInvocationTime.toDate().toISOString()}] Party ${partyId}: ChelseaNeilWedding.ics prepared.`);
      } else {
        console.error(`[${functionInvocationTime.toDate().toISOString()}] Party ${partyId}: Failed to generate ChelseaNeilWedding.ics content.`);
      }
    }

    console.log(`[${functionInvocationTime.toDate().toISOString()}] Party ${partyId}: Final attachments array length: ${attachments.length}`, attachments.map(a => a.filename));

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${APP_NAME}" <${gmailEmail}>`,
      to: recipientEmails,
      subject: `RSVP Confirmation - ${APP_NAME}`,
      html: generateEmailHtml(partyMembers, isAnyPartyMemberAttendingHindu, isAnyPartyMemberAttendingWedding),
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    try {
      await mailTransport.sendMail(mailOptions);
      console.log(
        `[${functionInvocationTime.toDate().toISOString()}] Party RSVP confirmation email sent successfully to ${recipientEmails} for party ${partyId}.`
      );
      // The cooldown timestamp is now set by the transaction, so no need to set it again here.
      // console.log(`Cooldown timestamp was updated by transaction for party ${partyId}.`);
    } catch (error) {
      console.error(
        `[${functionInvocationTime.toDate().toISOString()}] ERROR sending party RSVP confirmation to ${recipientEmails} for party ${partyId}:`,
        error
      );
      // Note: If email sending fails, the cooldown timestamp from the transaction still stands.
      // This prevents rapid retries if the email system itself is having issues, which is generally good.
    }
    return null;
  });
// --- End Firebase Cloud Function ---

// --- HTML Email Generation Function ---
function generateEmailHtml(partyMembers: Guest[], isAnyPartyMemberAttendingHindu: boolean, isAnyPartyMemberAttendingWedding: boolean): string {
  const formatBoolean = (value: boolean | undefined) => (value ? "Yes" : "No");
  const notProvided = "<i style='color: #757575;'>Not provided</i>";
  const isSinglePersonParty = partyMembers.length === 1;

  const bodyStyle = "font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0; padding: 0;";
  const containerStyle = "max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);";
  const headerStyle = "color: #00796b; font-size: 22px; margin-bottom: 10px; text-align: center;";
  const memberSummaryHeaderStyle = "font-size: 1.1em; color: #333; margin-top: 15px; margin-bottom: 5px; font-weight: bold;";
  const paragraphStyle = "margin-bottom: 10px;";
  const summaryParagraphStyle = "margin-bottom: 4px;";
  const strongStyle = "font-weight: bold; color: #555;";
  const hrStyle = "border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;";
  const footerTextStyle = "font-size: 0.9em; color: #757575; margin-top: 25px; text-align: center;";
  const smallDetailStyle = "padding-left: 15px; font-size: 0.9em; color: #555;";
  const linkStyle = "display: block; width: fit-content; margin: 20px auto; background-color: #00796b; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 1.1em; text-align: center;";

  let introMessage = "";
  const youOrYourParty = isSinglePersonParty ? "you" : "your party";
  const youOrYourPartyPossessive = isSinglePersonParty ? "your" : "your party's"; // for summary lead-in

  if (isAnyPartyMemberAttendingHindu && isAnyPartyMemberAttendingWedding) {
    introMessage = `<p style='${paragraphStyle}'>Thank you for submitting ${youOrYourPartyPossessive} RSVP for our wedding celebration! We're so excited to have ${youOrYourParty} for both events on October 10 and 11.</p>`;
  } else if (isAnyPartyMemberAttendingHindu) {
    introMessage = `<p style='${paragraphStyle}'>Thank you for submitting ${youOrYourPartyPossessive} RSVP for our wedding celebration! We're so excited to have ${youOrYourParty} for the Hindu Ceremony on October 10th.</p>`;
  } else if (isAnyPartyMemberAttendingWedding) {
    introMessage = `<p style='${paragraphStyle}'>Thank you for submitting ${youOrYourPartyPossessive} RSVP for our wedding celebration! We're so excited to have ${youOrYourParty} for the Wedding + Reception on October 11th.</p>`;
  } else {
    introMessage = `<p style='${paragraphStyle}'>Thank you for submitting ${youOrYourPartyPossessive} RSVP. We're sad to miss ${isSinglePersonParty ? "you" : "you all"} this time but hope to catch up soon!</p>`;
  }

  const changeInstructions = isSinglePersonParty ? 
    `<p style='${paragraphStyle}'>If you need to make any changes before July 15th, please resubmit the RSVP form on our website. Otherwise, please contact us directly ASAP.</p>`:
    `<p style='${paragraphStyle}'>If any changes are needed for your party before July 15th, please have any member resubmit the RSVP form on our website. Otherwise, please contact us directly ASAP.</p>`;

  let closingRemarksArr = [changeInstructions];
  if (isAnyPartyMemberAttendingHindu || isAnyPartyMemberAttendingWedding) {
    closingRemarksArr.push(`<p style='${paragraphStyle}'>We can't wait to celebrate with you!</p>`);
  }
  closingRemarksArr.push(
    `<p style='${paragraphStyle}'>Warmly,</p>`,
    `<p style='${paragraphStyle}'>Chelsea and Neil</p>`
  );
  const closingRemarksHtml = closingRemarksArr.join("\n");

  const websiteLinkHtml = `<a href="https://vandergoel.com" style='${linkStyle}'>Visit Our Wedding Website</a>`;
  
  let greeting = "";
  if (isSinglePersonParty) {
    greeting = `<p style='${paragraphStyle}'>Dear ${partyMembers[0].firstName},</p>`;
  } else {
    const names = partyMembers.map(member => member.firstName);
    if (names.length === 2) {
      greeting = `<p style='${paragraphStyle}'>Dear ${names[0]} and ${names[1]},</p>`;
    } else if (names.length > 1) {
      const lastPerson = names.pop();
      greeting = `<p style='${paragraphStyle}'>Dear ${names.join(', ')}, and ${lastPerson},</p>`;
    } else if (names.length === 1) {
      greeting = `<p style='${paragraphStyle}'>Dear ${names[0]},</p>`;
    }
  }

  const summaryLeadIn = isSinglePersonParty ? 
    `<p style='${paragraphStyle}'>Here's a summary of your response:</p>`:
    `<p style='${paragraphStyle}'>Here's a summary of your party's responses:</p>`;

  let topSectionHtml = [
    greeting,
    introMessage,
    closingRemarksHtml, 
    websiteLinkHtml,    
    summaryLeadIn,
    `<hr style='${hrStyle}' />`,
  ].join("\n");

  let memberSummariesHtml = partyMembers.map(member => {
    let memberRsvpDetails = [];
    const rsvp = member.rsvpResponse;

    memberRsvpDetails.push(`<h4 style='${memberSummaryHeaderStyle}'>RSVP Summary for ${member.firstName} ${member.lastName}:</h4>`);
    
    if (!rsvp) {
      memberRsvpDetails.push(`<p style='${summaryParagraphStyle}'>${notProvided}</p>`);
    } else {
      memberRsvpDetails.push(
        `<p style='${summaryParagraphStyle}'><strong style='${strongStyle}'>Email:</strong> ${rsvp.email || notProvided}</p>`,
        `<p style='${summaryParagraphStyle}'><strong style='${strongStyle}'>Attending Hindu Ceremony on October 10th:</strong> ${formatBoolean(rsvp.hinduCeremonyAttending)}</p>`, 
        `<p style='${summaryParagraphStyle}'><strong style='${strongStyle}'>Attending Wedding & Reception on October 11th:</strong> ${formatBoolean(rsvp.weddingReceptionAttending)}</p>`
      );

      if (rsvp.weddingReceptionAttending) {
        memberRsvpDetails.push(
          `<p style='${summaryParagraphStyle}'><strong style='${strongStyle}'>Meal Preference:</strong> ${rsvp.mealPreference || "Not selected"}</p>`
        );
      }
      memberRsvpDetails.push(
        `<p style='${summaryParagraphStyle}'><strong style='${strongStyle}'>Dietary Restrictions:</strong> ${rsvp.dietaryRestrictions || notProvided}</p>`
      );

      if (rsvp.needsRideToHinduCeremony || rsvp.needsRideToWedding || rsvp.canOfferRide) {
        memberRsvpDetails.push(`<p style='${summaryParagraphStyle}'><strong style='${strongStyle}'>Transportation Notes:</strong></p>`);
        if (rsvp.needsRideToHinduCeremony) {
          memberRsvpDetails.push(`<p style='${smallDetailStyle}'>Needs Ride to Hindu Ceremony: Yes` + (rsvp.hinduCeremonyRideDetails ? ` (${rsvp.hinduCeremonyRideDetails})` : '') + `</p>`);
        }
        if (rsvp.needsRideToWedding) {
          memberRsvpDetails.push(`<p style='${smallDetailStyle}'>Needs Ride to Wedding/Reception: Yes` + (rsvp.weddingRideDetails ? ` (${rsvp.weddingRideDetails})` : '') + `</p>`);
        }
        if (rsvp.canOfferRide) {
          memberRsvpDetails.push(`<p style='${smallDetailStyle}'>Can Offer a Ride: Yes` + (rsvp.rideOfferDetails ? ` (${rsvp.rideOfferDetails})` : '') + `</p>`);
        }
      }
      if (rsvp.otherComments) {
        memberRsvpDetails.push(
          `<p style='${summaryParagraphStyle}'><strong style='${strongStyle}'>Other Comments:</strong> ${rsvp.otherComments}</p>`
        );
      }
    }
    return memberRsvpDetails.join("\n");
  }).join("<hr style='border:none; border-top: 1px dashed #ccc; margin: 15px 0;' />");

  const detailsContent = topSectionHtml + memberSummariesHtml;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${APP_NAME} - RSVP Confirmation</title>
    </head>
    <body style="${bodyStyle}">
      <div style="${containerStyle}">
        <h2 style="${headerStyle}">${APP_NAME} - RSVP Confirmation</h2>
        ${detailsContent}
        <p style="${footerTextStyle}">
          This is an automated message from an inbox Chelsea and Neil monitor. You can reply directly to this email if you have any questions.
        </p>
      </div>
    </body>
    </html>
  `;
}
// --- End HTML Email Generation Function --- 